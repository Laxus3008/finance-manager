import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  topCategories: [{
    category: String,
    amount: Number,
    percentage: Number
  }],
  savingTips: [String],
  areasToImprove: [String],
  suggestedMonthlySavingGoal: {
    type: Number,
    default: 0
  },
  totalSpending: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
aiAnalysisSchema.index({ user: 1, year: -1, month: -1 });

const AIAnalysis = mongoose.model('AIAnalysis', aiAnalysisSchema);

export default AIAnalysis;