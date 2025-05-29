import mongoose, { Schema } from 'mongoose';
import { ITransaction } from './Transaction.interface';

const TransactionSchema: Schema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    isExpense: { type: Boolean, default: true },
    isShared: { type: Boolean, default: false },
    partnerId: { type: String },
    creditCard: { type: Schema.Types.ObjectId, ref: 'CreditCard' },
    isCreditCardBill: { type: Boolean, default: false },
    billingMonth: { type: Date },
    notes: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

TransactionSchema.index({ date: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ billingMonth: 1 });
TransactionSchema.index({ isExpense: 1 });

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);
