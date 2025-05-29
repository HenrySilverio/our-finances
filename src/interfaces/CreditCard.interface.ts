import { Document } from 'mongoose';

export interface ICreditCard extends Document {
  name: string;
  lasFourDigits?: string;
  ClosingDay?: number;
  DueDay?: number;
  Limit?: number;
  Color?: string;
  isActive: boolean;
  createDate: Date;
  updateDate: Date;
}
