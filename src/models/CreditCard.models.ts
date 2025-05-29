import { ICreditCard } from '@/interfaces/CreditCard.interface';
import mongoose, { Schema } from 'mongoose';

const CreditCardSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    lasFourDigits: { type: String, trim: true, maxlength: 4 },
    ClosingDay: { type: Number, min: 1, max: 31 },
    DueDay: { type: Number, min: 1, max: 31 },
    Limit: { type: Number, min: 0 },
    Color: { type: String, default: '#000080' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.CreditCard ||
  mongoose.model<ICreditCard>('CreditCard', CreditCardSchema);
