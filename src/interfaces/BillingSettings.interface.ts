import { Document, Types } from 'mongoose';

export interface IBillingSettings extends Document {
  creditCard: Types.ObjectId;
  manualClosingDates: Array<{
    month: number;
    year: number;
    closingDay: number;
  }>;
  createAt: Date;
  upDateAt: Date;
}
