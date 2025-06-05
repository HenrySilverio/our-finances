import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  accountId?: mongoose.Types.ObjectId;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  transactionDate: Date;
  creditCardId?: mongoose.Types.ObjectId;
  invoiceMonth?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID do usuário é obrigatório'],
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: function(this: ITransaction) {
        return !this.creditCardId; // Obrigatório se não for cartão de crédito
      },
    },
    type: {
      type: String,
      required: [true, 'Tipo da transação é obrigatório'],
      enum: {
        values: ['income', 'expense'],
        message: 'Tipo deve ser: income ou expense',
      },
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Valor é obrigatório'],
      min: [0.01, 'Valor deve ser maior que zero'],
    },
    description: {
      type: String,
      trim: true,
    },
    transactionDate: {
      type: Date,
      required: [true, 'Data da transação é obrigatória'],
      default: Date.now,
    },
    creditCardId: {
      type: Schema.Types.ObjectId,
      ref: 'CreditCard',
    },
    invoiceMonth: {
      type: String,
      match: [/^\d{4}-\d{2}$/, 'Formato deve ser YYYY-MM'],
      required: function(this: ITransaction) {
        return !!this.creditCardId; // Obrigatório se for cartão de crédito
      },
    },
  },
  {
    timestamps: true,
  }
);

// Índices para otimização
TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ userId: 1, type: 1 });
TransactionSchema.index({ userId: 1, category: 1 });
TransactionSchema.index({ userId: 1, transactionDate: 1 });
TransactionSchema.index({ creditCardId: 1, invoiceMonth: 1 });
TransactionSchema.index({ accountId: 1 });

// Validação customizada para garantir que apenas uma das opções seja preenchida
TransactionSchema.pre('validate', function (next) {
  if (this.accountId && this.creditCardId) {
    next(new Error('Transação deve ter apenas conta bancária OU cartão de crédito, não ambos'));
  }
  if (!this.accountId && !this.creditCardId) {
    next(new Error('Transação deve ter conta bancária ou cartão de crédito'));
  }
  next();
});

export const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;

