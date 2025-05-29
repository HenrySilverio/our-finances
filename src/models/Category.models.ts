import { ICategory } from '@/interfaces/Category.interface';
import mongoose, { Schema } from 'mongoose';

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    color: { type: String, default: '#4285f4' },
    icon: { type: String },
    isSavings: { type: Boolean, default: false },
    isExpense: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);
