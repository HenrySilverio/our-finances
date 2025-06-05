import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Account, Transaction } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const account = await Account.findById(params.id);

    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error('Erro ao buscar conta:', error);
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
    const { name, type, initialBalance, currentBalance } = body;

    const account = await Account.findById(params.id);
    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar campos
    if (name) account.name = name.trim();
    if (type) account.type = type;
    if (initialBalance !== undefined) account.initialBalance = parseFloat(initialBalance);
    if (currentBalance !== undefined) account.currentBalance = parseFloat(currentBalance);

    await account.save();

    return NextResponse.json(account);
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
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
    const transactionCount = await Transaction.countDocuments({ accountId: params.id });
    
    if (transactionCount > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir conta com transações associadas' },
        { status: 400 }
      );
    }

    const account = await Account.findByIdAndDelete(params.id);
    
    if (!account) {
      return NextResponse.json(
        { error: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

