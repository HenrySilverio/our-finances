import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Account } from '@/models';

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

    const accounts = await Account.find(filters).sort({ createdAt: -1 });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Erro ao buscar contas:', error);
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
    const { userId, name, type, initialBalance } = body;

    // Validações básicas
    if (!userId || !name || !type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: userId, name, type' },
        { status: 400 }
      );
    }

    const accountData = {
      userId,
      name: name.trim(),
      type,
      initialBalance: parseFloat(initialBalance) || 0,
    };

    const account = new Account(accountData);
    await account.save();

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

