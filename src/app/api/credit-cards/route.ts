import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { CreditCard } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const creditCards = await CreditCard.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(creditCards);
  } catch (error) {
    console.error('Erro ao buscar cartões:', error);
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
    const { userId, name, limit, closingDay, dueDay } = body;

    // Validações básicas
    if (!userId || !name || !limit || !closingDay || !dueDay) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: userId, name, limit, closingDay, dueDay' },
        { status: 400 }
      );
    }

    // Validar dias
    if (closingDay < 1 || closingDay > 31) {
      return NextResponse.json(
        { error: 'Dia de fechamento deve ser entre 1 e 31' },
        { status: 400 }
      );
    }

    if (dueDay < 1 || dueDay > 31) {
      return NextResponse.json(
        { error: 'Dia de vencimento deve ser entre 1 e 31' },
        { status: 400 }
      );
    }

    const creditCardData = {
      userId,
      name: name.trim(),
      limit: parseFloat(limit),
      closingDay: parseInt(closingDay),
      dueDay: parseInt(dueDay),
    };

    const creditCard = new CreditCard(creditCardData);
    await creditCard.save();

    return NextResponse.json(creditCard, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

