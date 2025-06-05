import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Transaction, CreditCard } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const invoiceMonth = searchParams.get('month');
    
    if (!invoiceMonth) {
      return NextResponse.json(
        { error: 'Mês da fatura é obrigatório (formato: YYYY-MM)' },
        { status: 400 }
      );
    }

    // Verificar se o cartão existe
    const creditCard = await CreditCard.findById(params.id);
    if (!creditCard) {
      return NextResponse.json(
        { error: 'Cartão não encontrado' },
        { status: 404 }
      );
    }

    // Buscar transações da fatura
    const transactions = await Transaction.find({
      creditCardId: params.id,
      invoiceMonth: invoiceMonth,
    }).sort({ transactionDate: -1 });

    // Calcular total da fatura
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    return NextResponse.json({
      creditCard: {
        id: creditCard._id,
        name: creditCard.name,
        limit: creditCard.limit,
        closingDay: creditCard.closingDay,
        dueDay: creditCard.dueDay,
      },
      invoiceMonth,
      transactions,
      total,
      availableLimit: creditCard.limit - total,
    });
  } catch (error) {
    console.error('Erro ao buscar fatura:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

