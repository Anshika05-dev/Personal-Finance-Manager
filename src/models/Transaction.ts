import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Other'
  }
})

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)
