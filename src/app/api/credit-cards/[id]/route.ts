import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { CreditCard, Transaction } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const creditCard = await CreditCard.findById(params.id);

    if (!creditCard) {
      return NextResponse.json(
        { error: 'Cartão não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(creditCard);
  } catch (error) {
    console.error('Erro ao buscar cartão:', error);
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
    const { name, limit, closingDay, dueDay, currentInvoiceMonth } = body;

    const creditCard = await CreditCard.findById(params.id);
    if (!creditCard) {
      return NextResponse.json(
        { error: 'Cartão não encontrado' },
        { status: 404 }
      );
    }

    // Validar dias se fornecidos
    if (closingDay && (closingDay < 1 || closingDay > 31)) {
      return NextResponse.json(
        { error: 'Dia de fechamento deve ser entre 1 e 31' },
        { status: 400 }
      );
    }

    if (dueDay && (dueDay < 1 || dueDay > 31)) {
      return NextResponse.json(
        { error: 'Dia de vencimento deve ser entre 1 e 31' },
        { status: 400 }
      );
    }

    // Atualizar campos
    if (name) creditCard.name = name.trim();
    if (limit !== undefined) creditCard.limit = parseFloat(limit);
    if (closingDay) creditCard.closingDay = parseInt(closingDay);
    if (dueDay) creditCard.dueDay = parseInt(dueDay);
    if (currentInvoiceMonth) creditCard.currentInvoiceMonth = currentInvoiceMonth;

    await creditCard.save();

    return NextResponse.json(creditCard);
  } catch (error) {
    console.error('Erro ao atualizar cartão:', error);
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
    
    // Verificar se há transações associadas
    const transactionCount = await Transaction.countDocuments({ creditCardId: params.id });
    
    if (transactionCount > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir cartão com transações associadas' },
        { status: 400 }
      );
    }

    const creditCard = await CreditCard.findByIdAndDelete(params.id);
    
    if (!creditCard) {
      return NextResponse.json(
        { error: 'Cartão não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Cartão excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir cartão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

