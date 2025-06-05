import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'cash';
  initialBalance: number;
  currentBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID do usuário é obrigatório'],
    },
    name: {
      type: String,
      required: [true, 'Nome da conta é obrigatório'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Tipo da conta é obrigatório'],
      enum: {
        values: ['checking', 'savings', 'investment', 'cash'],
        message: 'Tipo deve ser: checking, savings, investment ou cash',
      },
    },
    initialBalance: {
      type: Number,
      required: [true, 'Saldo inicial é obrigatório'],
      default: 0,
    },
    currentBalance: {
      type: Number,
      required: [true, 'Saldo atual é obrigatório'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para otimização
AccountSchema.index({ userId: 1 });
AccountSchema.index({ userId: 1, type: 1 });

// Middleware para definir saldo atual igual ao inicial na criação
AccountSchema.pre('save', function (next) {
  if (this.isNew && this.currentBalance === 0) {
    this.currentBalance = this.initialBalance;
  }
  next();
});

export const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);

export default Account;

