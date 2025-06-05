'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet,
  CreditCard,
  PiggyBank
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data - em produção viria da API
const mockData = {
  summary: {
    income: 8500,
    expenses: 6200,
    netBalance: 2300,
    totalAccountBalance: 15000,
    totalInvestments: 25000,
    totalWealth: 40000,
  },
  monthlyData: [
    { month: 'Jan', income: 8000, expenses: 5500 },
    { month: 'Fev', income: 8200, expenses: 6000 },
    { month: 'Mar', income: 8500, expenses: 6200 },
    { month: 'Abr', income: 8300, expenses: 5800 },
    { month: 'Mai', income: 8600, expenses: 6400 },
    { month: 'Jun', income: 8500, expenses: 6200 },
  ],
  expensesByCategory: [
    { name: 'Alimentação', value: 1800, color: '#3B82F6' },
    { name: 'Transporte', value: 1200, color: '#EF4444' },
    { name: 'Moradia', value: 2000, color: '#10B981' },
    { name: 'Lazer', value: 800, color: '#F59E0B' },
    { name: 'Outros', value: 400, color: '#8B5CF6' },
  ],
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: number;
  color: string;
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-md ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{formatCurrency(value)}</p>
          {trend !== undefined && (
            <div className="flex items-center mt-1">
              {trend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { summary, monthlyData, expensesByCategory } = mockData;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das suas finanças</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Receitas do Mês"
            value={summary.income}
            icon={TrendingUp}
            trend={5.2}
            color="bg-green-500"
          />
          <StatCard
            title="Despesas do Mês"
            value={summary.expenses}
            icon={TrendingDown}
            color="bg-red-500"
          />
          <StatCard
            title="Saldo Líquido"
            value={summary.netBalance}
            icon={DollarSign}
            trend={12.5}
            color="bg-blue-500"
          />
          <StatCard
            title="Contas Bancárias"
            value={summary.totalAccountBalance}
            icon={Wallet}
            color="bg-purple-500"
          />
          <StatCard
            title="Investimentos"
            value={summary.totalInvestments}
            icon={PiggyBank}
            trend={8.3}
            color="bg-indigo-500"
          />
          <StatCard
            title="Patrimônio Total"
            value={summary.totalWealth}
            icon={CreditCard}
            trend={6.7}
            color="bg-gray-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Income vs Expenses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Receitas vs Despesas (Últimos 6 meses)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(value),
                    ''
                  ]}
                />
                <Bar dataKey="income" fill="#10B981" name="Receitas" />
                <Bar dataKey="expenses" fill="#EF4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expenses by Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Despesas por Categoria
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(value),
                    'Valor'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-600">Nova Transação</span>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-600">Novo Cartão</span>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <PiggyBank className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-600">Novo Investimento</span>
              </div>
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <Wallet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-600">Nova Conta</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

