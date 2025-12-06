import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
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
  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },
  categoryBudgets: {
    Food: { type: Number, default: 0 },
    Rent: { type: Number, default: 0 },
    Transport: { type: Number, default: 0 },
    Shopping: { type: Number, default: 0 },
    Subscriptions: { type: Number, default: 0 },
    Entertainment: { type: Number, default: 0 },
    Healthcare: { type: Number, default: 0 },
    Utilities: { type: Number, default: 0 },
    Others: { type: Number, default: 0 }
  },
  alertThreshold: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Ensure one budget per user per month
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;