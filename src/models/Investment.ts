import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvestment extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'stock' | 'fund' | 'crypto' | 'pension';
  assetName: string;
  amountInvested: number;
  currentValue: number;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  getReturn(): number;
  getReturnPercentage(): number;
}

const InvestmentSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID do usuário é obrigatório'],
    },
    type: {
      type: String,
      required: [true, 'Tipo do investimento é obrigatório'],
      enum: {
        values: ['stock', 'fund', 'crypto', 'pension'],
        message: 'Tipo deve ser: stock, fund, crypto ou pension',
      },
    },
    assetName: {
      type: String,
      required: [true, 'Nome do ativo é obrigatório'],
      trim: true,
    },
    amountInvested: {
      type: Number,
      required: [true, 'Valor investido é obrigatório'],
      min: [0.01, 'Valor investido deve ser maior que zero'],
    },
    currentValue: {
      type: Number,
      required: [true, 'Valor atual é obrigatório'],
      min: [0, 'Valor atual deve ser maior ou igual a zero'],
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Data da compra é obrigatória'],
    },
  },
  {
    timestamps: true,
  }
);

// Índices para otimização
InvestmentSchema.index({ userId: 1 });
InvestmentSchema.index({ userId: 1, type: 1 });
InvestmentSchema.index({ userId: 1, purchaseDate: 1 });

// Método para calcular retorno absoluto
InvestmentSchema.methods.getReturn = function(): number {
  return this.currentValue - this.amountInvested;
};

// Método para calcular retorno percentual
InvestmentSchema.methods.getReturnPercentage = function(): number {
  if (this.amountInvested === 0) return 0;
  return ((this.currentValue - this.amountInvested) / this.amountInvested) * 100;
};

// Middleware para definir valor atual igual ao investido na criação (se não especificado)
InvestmentSchema.pre('save', function (next) {
  if (this.isNew && this.currentValue === 0) {
    this.currentValue = this.amountInvested;
  }
  next();
});

export const Investment: Model<IInvestment> = mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);

export default Investment;

