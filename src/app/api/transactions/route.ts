import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Transaction, CreditCard } from '@/models';
import { calculateInvoiceMonth } from '@/utils/dateUtils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Construir filtros
    const filters: any = { userId };
    
    if (type) filters.type = type;
    if (category) filters.category = category;
    
    if (startDate || endDate) {
      filters.transactionDate = {};
      if (startDate) filters.transactionDate.$gte = new Date(startDate);
      if (endDate) filters.transactionDate.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filters)
      .populate('accountId', 'name type')
      .populate('creditCardId', 'name')
      .sort({ transactionDate: -1 });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const {
      userId,
      accountId,
      creditCardId,
      type,
      category,
      amount,
      description,
      transactionDate,
    } = body;

    // Validações básicas
    if (!userId || !type || !category || !amount) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: userId, type, category, amount' },
        { status: 400 }
      );
    }

    if (!accountId && !creditCardId) {
      return NextResponse.json(
        { error: 'Deve especificar conta bancária ou cartão de crédito' },
        { status: 400 }
      );
    }

    if (accountId && creditCardId) {
      return NextResponse.json(
        { error: 'Não pode especificar conta bancária e cartão de crédito simultaneamente' },
        { status: 400 }
      );
    }

    let invoiceMonth;
    
    // Se for cartão de crédito, calcular mês da fatura
    if (creditCardId) {
      const creditCard = await CreditCard.findById(creditCardId);
      if (!creditCard) {
        return NextResponse.json(
          { error: 'Cartão de crédito não encontrado' },
          { status: 404 }
        );
      }
      
      const txDate = transactionDate ? new Date(transactionDate) : new Date();
      invoiceMonth = calculateInvoiceMonth(txDate, creditCard.closingDay);
    }

    // Criar transação
    const transactionData = {
      userId,
      accountId: accountId || undefined,
      creditCardId: creditCardId || undefined,
      type,
      category,
      amount: parseFloat(amount),
      description,
      transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
      invoiceMonth,
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Popular dados relacionados para retorno
    await transaction.populate('accountId', 'name type');
    await transaction.populate('creditCardId', 'name');

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

