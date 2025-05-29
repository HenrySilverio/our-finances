import { Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isSavings: boolean;
  isExpense: boolean;
  createAt: Date;
  upDateAt: Date;
}
