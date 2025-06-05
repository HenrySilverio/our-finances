import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Transaction, CreditCard } from '@/models';
import { calculateInvoiceMonth } from '@/utils/dateUtils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const transaction = await Transaction.findById(params.id)
      .populate('accountId', 'name type')
      .populate('creditCardId', 'name');

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const {
      accountId,
      creditCardId,
      type,
      category,
      amount,
      description,
      transactionDate,
    } = body;

    const transaction = await Transaction.findById(params.id);
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    // Validações
    if (accountId && creditCardId) {
      return NextResponse.json(
        { error: 'Não pode especificar conta bancária e cartão de crédito simultaneamente' },
        { status: 400 }
      );
    }

    let invoiceMonth = transaction.invoiceMonth;
    
    // Se mudou para cartão de crédito ou mudou a data, recalcular mês da fatura
    if (creditCardId && (creditCardId !== transaction.creditCardId?.toString() || transactionDate)) {
      const creditCard = await CreditCard.findById(creditCardId);
      if (!creditCard) {
        return NextResponse.json(
          { error: 'Cartão de crédito não encontrado' },
          { status: 404 }
        );
      }
      
      const txDate = transactionDate ? new Date(transactionDate) : transaction.transactionDate;
      invoiceMonth = calculateInvoiceMonth(txDate, creditCard.closingDay);
    }

    // Atualizar campos
    if (accountId !== undefined) transaction.accountId = accountId || undefined;
    if (creditCardId !== undefined) transaction.creditCardId = creditCardId || undefined;
    if (type) transaction.type = type;
    if (category) transaction.category = category;
    if (amount) transaction.amount = parseFloat(amount);
    if (description !== undefined) transaction.description = description;
    if (transactionDate) transaction.transactionDate = new Date(transactionDate);
    if (invoiceMonth) transaction.invoiceMonth = invoiceMonth;

    await transaction.save();

    // Popular dados relacionados para retorno
    await transaction.populate('accountId', 'name type');
    await transaction.populate('creditCardId', 'name');

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const transaction = await Transaction.findByIdAndDelete(params.id);
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

