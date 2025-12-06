import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';

// @desc    Get budget for a specific month
// @route   GET /api/budgets
// @access  Private
export const getBudget = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    let budget = await Budget.findOne({
      user: req.user._id,
      month: targetMonth,
      year: targetYear
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found for this month' });
    }

    // Calculate spending for the month
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      user: req.user._id,
      type: 'expense',
      date: { $gte: startDate, $lte: endDate }
    });

    // Calculate totals
    let totalSpent = 0;
    const categorySpending = {};

    transactions.forEach(transaction => {
      totalSpent += transaction.amount;
      categorySpending[transaction.category] = 
        (categorySpending[transaction.category] || 0) + transaction.amount;
    });

    // Calculate alerts
    const totalPercentage = (totalSpent / budget.totalBudget) * 100;
    const alerts = [];

    if (totalPercentage >= 100) {
      alerts.push({ type: 'danger', message: 'You have exceeded your total budget!' });
    } else if (totalPercentage >= budget.alertThreshold) {
      alerts.push({ type: 'warning', message: `You have used ${totalPercentage.toFixed(1)}% of your budget` });
    }

    // Check category budgets
    Object.keys(budget.categoryBudgets).forEach(category => {
      const categoryBudget = budget.categoryBudgets[category];
      const categorySpent = categorySpending[category] || 0;
      
      if (categoryBudget > 0) {
        const categoryPercentage = (categorySpent / categoryBudget) * 100;
        
        if (categoryPercentage >= 100) {
          alerts.push({ 
            type: 'danger', 
            category,
            message: `${category} budget exceeded!` 
          });
        } else if (categoryPercentage >= budget.alertThreshold) {
          alerts.push({ 
            type: 'warning', 
            category,
            message: `${category}: ${categoryPercentage.toFixed(1)}% used` 
          });
        }
      }
    });

    res.json({
      budget,
      spending: {
        total: totalSpent,
        byCategory: categorySpending
      },
      alerts,
      status: totalPercentage >= 100 ? 'over' : totalPercentage >= budget.alertThreshold ? 'warning' : 'ok'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update budget
// @route   POST /api/budgets
// @access  Private
export const createOrUpdateBudget = async (req, res) => {
  try {
    const { month, year, totalBudget, categoryBudgets, alertThreshold } = req.body;

    if (!month || !year || !totalBudget) {
      return res.status(400).json({ message: 'Please provide month, year, and total budget' });
    }

    const budgetData = {
      user: req.user._id,
      month: parseInt(month),
      year: parseInt(year),
      totalBudget,
      categoryBudgets: categoryBudgets || {},
      alertThreshold: alertThreshold || 80
    };

    let budget = await Budget.findOne({
      user: req.user._id,
      month: parseInt(month),
      year: parseInt(year)
    });

    if (budget) {
      // Update existing budget
      budget = await Budget.findByIdAndUpdate(
        budget._id,
        budgetData,
        { new: true, runValidators: true }
      );
      res.json(budget);
    } else {
      // Create new budget
      budget = await Budget.create(budgetData);
      res.status(201).json(budget);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Make sure user owns budget
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all budgets for user
// @route   GET /api/budgets/all
// @access  Private
export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id })
      .sort({ year: -1, month: -1 });
    
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};