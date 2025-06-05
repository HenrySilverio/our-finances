import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICreditCard extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  currentInvoiceMonth: string;
  createdAt: Date;
  updatedAt: Date;
}

const CreditCardSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID do usuário é obrigatório'],
    },
    name: {
      type: String,
      required: [true, 'Nome do cartão é obrigatório'],
      trim: true,
    },
    limit: {
      type: Number,
      required: [true, 'Limite do cartão é obrigatório'],
      min: [0, 'Limite deve ser maior ou igual a zero'],
    },
    closingDay: {
      type: Number,
      required: [true, 'Dia de fechamento é obrigatório'],
      min: [1, 'Dia de fechamento deve ser entre 1 e 31'],
      max: [31, 'Dia de fechamento deve ser entre 1 e 31'],
    },
    dueDay: {
      type: Number,
      required: [true, 'Dia de vencimento é obrigatório'],
      min: [1, 'Dia de vencimento deve ser entre 1 e 31'],
      max: [31, 'Dia de vencimento deve ser entre 1 e 31'],
    },
    currentInvoiceMonth: {
      type: String,
      required: [true, 'Mês da fatura atual é obrigatório'],
      match: [/^\d{4}-\d{2}$/, 'Formato deve ser YYYY-MM'],
    },
  },
  {
    timestamps: true,
  }
);

// Índices para otimização
CreditCardSchema.index({ userId: 1 });
CreditCardSchema.index({ userId: 1, currentInvoiceMonth: 1 });

// Middleware para definir mês da fatura atual na criação
CreditCardSchema.pre('save', function (next) {
  if (this.isNew && !this.currentInvoiceMonth) {
    const now = new Date();
    this.currentInvoiceMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
  next();
});

export const CreditCard: Model<ICreditCard> = mongoose.models.CreditCard || mongoose.model<ICreditCard>('CreditCard', CreditCardSchema);

export default CreditCard;

