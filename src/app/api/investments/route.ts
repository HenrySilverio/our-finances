import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Investment } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const filters: any = { userId };
    if (type) filters.type = type;

    const investments = await Investment.find(filters).sort({ purchaseDate: -1 });

    // Calcular totais
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amountInvested, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalReturn = totalCurrentValue - totalInvested;
    const totalReturnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    return NextResponse.json({
      investments,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalReturn,
        totalReturnPercentage,
        count: investments.length,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar investimentos:', error);
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
    const { userId, type, assetName, amountInvested, currentValue, purchaseDate } = body;

    // Validações básicas
    if (!userId || !type || !assetName || !amountInvested || !purchaseDate) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: userId, type, assetName, amountInvested, purchaseDate' },
        { status: 400 }
      );
    }

    const investmentData = {
      userId,
      type,
      assetName: assetName.trim(),
      amountInvested: parseFloat(amountInvested),
      currentValue: currentValue ? parseFloat(currentValue) : parseFloat(amountInvested),
      purchaseDate: new Date(purchaseDate),
    };

    const investment = new Investment(investmentData);
    await investment.save();

    return NextResponse.json(investment, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar investimento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

