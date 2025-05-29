import { IBillingSettings } from '@/interfaces/BillingSettings.interface';
import mongoose, { Schema } from 'mongoose';

const BillingSettingsSchema: Schema = new Schema(
  {
    creditCard: {
      type: Schema.Types.ObjectId,
      ref: 'CreditCard',
      required: true,
    },
    manualClosingDates: [
      {
        month: { type: Number, required: true, min: 0, max: 11 },
        year: { type: Number, required: true },
        closingDay: { type: Number, required: true, min: 1, max: 31 },
      },
    ],
  },
  { timestamps: true },
);

BillingSettingsSchema.index({ creditCard: 1 });

export default mongoose.models.BillingSettings ||
  mongoose.model<IBillingSettings>('BillingSettings', BillingSettingsSchema);
