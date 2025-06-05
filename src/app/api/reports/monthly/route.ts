import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Transaction, Account, CreditCard, Investment } from '@/models';
import { getMonthRange } from '@/utils/dateUtils';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    // Obter range do mês
    const { firstDay, lastDay } = getMonthRange(currentYear, currentMonth);

    // Buscar transações do mês
    const transactions = await Transaction.find({
      userId,
      transactionDate: {
        $gte: firstDay,
        $lte: lastDay,
      },
    }).populate('accountId', 'name type')
      .populate('creditCardId', 'name');

    // Calcular totais
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = income - expenses;

    // Agrupar por categoria
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const incomeByCategory = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Buscar contas e saldos
    const accounts = await Account.find({ userId });
    const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

    // Buscar investimentos
    const investments = await Investment.find({ userId });
    const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);

    // Patrimônio total
    const totalWealth = totalAccountBalance + totalInvestments;

    return NextResponse.json({
      period: {
        year: currentYear,
        month: currentMonth,
        firstDay,
        lastDay,
      },
      summary: {
        income,
        expenses,
        netBalance,
        totalAccountBalance,
        totalInvestments,
        totalWealth,
      },
      categories: {
        expenses: expensesByCategory,
        income: incomeByCategory,
      },
      transactions: transactions.length,
      accounts: accounts.length,
      investments: investments.length,
    });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

