import { Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  description: string;
  amount: number;
  date: Date;
  category: Types.ObjectId;
  isExpense: boolean;
  isShared: boolean;
  partnerId?: string;
  creditCardId?: Types.ObjectId;
  isCreditCardBill: boolean;
  billingMonth?: Date;
  notes?: string;
  tags?: string[];
  createAt: Date;
  upDateAt: Date;
}