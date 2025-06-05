import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Investment } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const investment = await Investment.findById(params.id);

    if (!investment) {
      return NextResponse.json(
        { error: 'Investimento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(investment);
  } catch (error) {
    console.error('Erro ao buscar investimento:', error);
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
    const { type, assetName, amountInvested, currentValue, purchaseDate } = body;

    const investment = await Investment.findById(params.id);
    if (!investment) {
      return NextResponse.json(
        { error: 'Investimento não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar campos
    if (type) investment.type = type;
    if (assetName) investment.assetName = assetName.trim();
    if (amountInvested !== undefined) investment.amountInvested = parseFloat(amountInvested);
    if (currentValue !== undefined) investment.currentValue = parseFloat(currentValue);
    if (purchaseDate) investment.purchaseDate = new Date(purchaseDate);

    await investment.save();

    return NextResponse.json(investment);
  } catch (error) {
    console.error('Erro ao atualizar investimento:', error);
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
    
    const investment = await Investment.findByIdAndDelete(params.id);
    
    if (!investment) {
      return NextResponse.json(
        { error: 'Investimento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Investimento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir investimento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

