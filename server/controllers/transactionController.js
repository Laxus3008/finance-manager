import Transaction from '../models/Transaction.js';
import { categorizeTransaction } from '../utils/categorizeTransaction.js';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;
    
    let query = { user: req.user._id };

    // Add filters if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (category) query.category = category;
    if (type) query.type = type;

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const { date, description, amount, category, type } = req.body;

    if (!date || !description || !amount) {
      return res.status(400).json({ message: 'Please provide date, description, and amount' });
    }

    // Auto-categorize if no category provided
    const finalCategory = category || categorizeTransaction(description);

    const transaction = await Transaction.create({
      user: req.user._id,
      date,
      description,
      amount,
      category: finalCategory,
      type: type || 'expense'
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload CSV and create transactions
// @route   POST /api/transactions/upload
// @access  Private
// @desc    Upload CSV and create transactions
// @route   POST /api/transactions/upload
// @access  Private
export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = [];
    const { Readable } = await import('stream');
    
    // Convert buffer to stream
    const bufferStream = Readable.from(req.file.buffer.toString());

    bufferStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const transactions = [];

          for (const row of results) {
            // Assuming CSV format: date, description, amount
            const date = row.date || row.Date;
            const description = row.description || row.Description;
            const amount = parseFloat(row.amount || row.Amount);

            if (date && description && !isNaN(amount)) {
              const category = categorizeTransaction(description);
              
              transactions.push({
                user: req.user._id,
                date: new Date(date),
                description,
                amount: Math.abs(amount),
                category,
                type: 'expense'
              });
            }
          }

          if (transactions.length === 0) {
            return res.status(400).json({ message: 'No valid transactions found in CSV' });
          }

          const createdTransactions = await Transaction.insertMany(transactions);

          res.status(201).json({
            message: `${createdTransactions.length} transactions imported successfully`,
            transactions: createdTransactions
          });
        } catch (error) {
          console.error('CSV Processing Error:', error);
          res.status(500).json({ message: error.message });
        }
      })
      .on('error', (error) => {
        console.error('CSV Parse Error:', error);
        res.status(500).json({ message: 'Error parsing CSV file' });
      });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get spending summary
// @route   GET /api/transactions/summary
// @access  Private
export const getSpendingSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate totals by category
    const categoryTotals = {};
    let totalSpending = 0;
    let totalIncome = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        totalSpending += transaction.amount;
        categoryTotals[transaction.category] = 
          (categoryTotals[transaction.category] || 0) + transaction.amount;
      } else {
        totalIncome += transaction.amount;
      }
    });

    res.json({
      month: targetMonth,
      year: targetYear,
      totalSpending,
      totalIncome,
      categoryTotals,
      transactionCount: transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};