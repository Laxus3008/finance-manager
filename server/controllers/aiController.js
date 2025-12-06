import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/Transaction.js';
import AIAnalysis from '../models/AiAnalysis.js';

// IMPORTANT FIX: 
// 1. We remove the top-level initialization (const genAI = ...)
// 2. We initialize the client inside the function, ensuring process.env is loaded.

const modelName = "gemini-2.5-flash-preview-09-2025";


// @desc    Generate AI analysis for spending
// @route   POST /api/ai/analyze
// @access  Private
export const generateAnalysis = async (req, res) => {
    // --- START: FIX ---
    // Initialize the AI client here to ensure process.env.GEMINI_API_KEY is defined
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    // --- END: FIX ---

    try {
        const { month, year } = req.body;
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();
        const userId = req.user._id; 

        // Get transactions for the month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const transactions = await Transaction.find({
            user: userId,
            type: 'expense',
            date: { $gte: startDate, $lte: endDate }
        });

        if (transactions.length === 0) {
            return res.status(400).json({ message: 'No transactions found for this period' });
        }

        // Calculate spending by category
        const categoryTotals = {};
        let totalSpending = 0;

        transactions.forEach(transaction => {
            totalSpending += transaction.amount;
            categoryTotals[transaction.category] = 
                (categoryTotals[transaction.category] || 0) + transaction.amount;
        });

        // Prepare data for AI
        const topCategories = Object.entries(categoryTotals)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: ((amount / totalSpending) * 100).toFixed(2)
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        // --- Use Structured JSON Output Configuration for Reliability ---
        const prompt = `You are a financial advisor. Analyze the following spending data for ${getMonthName(targetMonth)} ${targetYear}:

Total Spending: $${totalSpending.toFixed(2)}
Number of Transactions: ${transactions.length}

Spending by Category:
${topCategories.map(cat => `- ${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage}%)`).join('\n')}

Based on this data, provide a detailed analysis in the requested JSON format. Ensure the suggestedMonthlySavingGoal is a realistic number (10-20% of total spending).`;

        const generationConfig = {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    summary: { type: "STRING" },
                    topCategories: { type: "STRING" },
                    areasToImprove: { type: "ARRAY", items: { type: "STRING" } },
                    savingTips: { type: "ARRAY", items: { type: "STRING" } },
                    suggestedMonthlySavingGoal: { type: "NUMBER" }
                }
            }
        };

        // Call Gemini API
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: generationConfig,
        });

        const response = await result.response;
        const aiResponseText = response.text();
        let parsedResponse = JSON.parse(aiResponseText);
        // const aiResponseText = result.response.text.trim();
        // let parsedResponse = JSON.parse(aiResponseText);
        
        // Ensure suggestedMonthlySavingGoal is a number if it came back as a string or null (though structured output prevents this)
        if (typeof parsedResponse.suggestedMonthlySavingGoal !== 'number') {
            parsedResponse.suggestedMonthlySavingGoal = Math.round(totalSpending * 0.15);
        }

        // Save AI analysis to database
        const analysis = await AIAnalysis.create({
            user: userId,
            month: targetMonth,
            year: targetYear,
            summary: parsedResponse.summary || 'Analysis generated',
            topCategories: topCategories,
            savingTips: parsedResponse.savingTips || [],
            areasToImprove: parsedResponse.areasToImprove || [],
            suggestedMonthlySavingGoal: parsedResponse.suggestedMonthlySavingGoal,
            totalSpending
        });

        res.status(201).json(analysis);

    } catch (error) {
        // Handle case where API key is explicitly missing during runtime
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'GEMINI_API_KEY is undefined. Check your .env file and server startup.' });
        }
        
        console.error('AI Analysis Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get AI analysis history
// @route   GET /api/ai/history
// @access  Private
export const getAnalysisHistory = async (req, res) => {
    try {
        const analyses = await AIAnalysis.find({ user: req.user._id })
            .sort({ year: -1, month: -1 })
            .limit(12);

        res.json(analyses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get specific AI analysis
// @route   GET /api/ai/analysis
// @access  Private
export const getAnalysis = async (req, res) => {
    try {
        const { month, year } = req.query;
        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const analysis = await AIAnalysis.findOne({
            user: req.user._id,
            month: targetMonth,
            year: targetYear
        });

        if (!analysis) {
            return res.status(404).json({ message: 'No analysis found for this period' });
        }

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function
function getMonthName(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
}