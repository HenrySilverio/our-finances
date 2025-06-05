'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  FileText,
  Target,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart
} from 'recharts';

// Interfaces
interface ReportData {
  period: string;
  income: number;
  expenses: number;
  balance: number;
  investments: number;
  creditCardExpenses: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  transactions: number;
}

interface MonthlyComparison {
  month: string;
  currentYear: number;
  previousYear: number;
  growth: number;
}

// Mock data
const mockReportData: ReportData[] = [
  { period: '2025-01', income: 8500, expenses: 6200, balance: 2300, investments: 950, creditCardExpenses: 2800 },
  { period: '2025-02', income: 8500, expenses: 5800, balance: 2700, investments: 4265, creditCardExpenses: 2400 },
  { period: '2025-03', income: 9200, expenses: 6800, balance: 2400, investments: 14000, creditCardExpenses: 3200 },
  { period: '2025-04', income: 8500, expenses: 6500, balance: 2000, investments: 0, creditCardExpenses: 2900 },
  { period: '2025-05', income: 8500, expenses: 6100, balance: 2400, investments: 0, creditCardExpenses: 2600 },
  { period: '2025-06', income: 8500, expenses: 6200, balance: 2300, investments: 0, creditCardExpenses: 2800 }
];

const mockCategoryData: CategoryData[] = [
  { category: 'Alimentação', amount: 1800, percentage: 29, color: '#3B82F6', transactions: 45 },
  { category: 'Transporte', amount: 1200, percentage: 19, color: '#EF4444', transactions: 28 },
  { category: 'Moradia', amount: 2000, percentage: 32, color: '#10B981', transactions: 12 },
  { category: 'Lazer', amount: 800, percentage: 13, color: '#F59E0B', transactions: 18 },
  { category: 'Outros', amount: 400, percentage: 7, color: '#8B5CF6', transactions: 22 }
];

const mockMonthlyComparison: MonthlyComparison[] = [
  { month: 'Jan', currentYear: 8500, previousYear: 7800, growth: 8.97 },
  { month: 'Fev', currentYear: 8500, previousYear: 8200, growth: 3.66 },
  { month: 'Mar', currentYear: 9200, previousYear: 8000, growth: 15.00 },
  { month: 'Abr', currentYear: 8500, previousYear: 8300, growth: 2.41 },
  { month: 'Mai', currentYear: 8500, previousYear: 8100, growth: 4.94 },
  { month: 'Jun', currentYear: 8500, previousYear: 8400, growth: 1.19 }
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(mockReportData);

  const periods = [
    { value: '1month', label: 'Último mês' },
    { value: '3months', label: 'Últimos 3 meses' },
    { value: '6months', label: 'Últimos 6 meses' },
    { value: '1year', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { value: 'income', label: 'Receitas', icon: TrendingUp },
    { value: 'expenses', label: 'Despesas', icon: TrendingDown },
    { value: 'categories', label: 'Por Categoria', icon: PieChart },
    { value: 'comparison', label: 'Comparativo', icon: Target },
    { value: 'cashflow', label: 'Fluxo de Caixa', icon: DollarSign }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const calculateTotals = () => {
    const totalIncome = reportData.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = reportData.reduce((sum, item) => sum + item.expenses, 0);
    const totalBalance = totalIncome - totalExpenses;
    const totalInvestments = reportData.reduce((sum, item) => sum + item.investments, 0);
    const avgMonthlyIncome = totalIncome / reportData.length;
    const avgMonthlyExpenses = totalExpenses / reportData.length;

    return {
      totalIncome,
      totalExpenses,
      totalBalance,
      totalInvestments,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      savingsRate: totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0
    };
  };

  const totals = calculateTotals();

  const handleExportReport = async (format: 'pdf' | 'excel') => {
    setIsLoading(true);
    try {
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em produção, aqui seria feita a chamada para a API de exportação
      const filename = `relatorio-financeiro-${selectedPeriod}-${Date.now()}.${format}`;
      console.log(`Exportando relatório: ${filename}`);
      
      // Simular download
      alert(`Relatório ${format.toUpperCase()} exportado com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('Erro ao exportar relatório. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simular atualização de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Em produção, aqui seria feita a chamada para a API
      setReportData([...mockReportData]);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios Financeiros</h1>
            <p className="text-gray-600">Análise detalhada das suas finanças</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleExportReport('pdf')}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalIncome)}</p>
                <p className="text-sm text-green-600">Média: {formatCurrency(totals.avgMonthlyIncome)}/mês</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowDownRight className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalExpenses)}</p>
                <p className="text-sm text-red-600">Média: {formatCurrency(totals.avgMonthlyExpenses)}/mês</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${totals.totalBalance >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-6 w-6 ${totals.totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${totals.totalBalance >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                  {formatCurrency(totals.totalBalance)}
                </p>
                <p className={`text-sm ${totals.totalBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Taxa de poupança: {totals.savingsRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Investimentos</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totals.totalInvestments)}</p>
                <p className="text-sm text-purple-600">No período</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        {selectedReport === 'overview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Receitas vs Despesas</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="period" 
                    tickFormatter={(value) => {
                      const date = new Date(value + '-01');
                      return date.toLocaleDateString('pt-BR', { month: 'short' });
                    }}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatCurrency(value), 
                      name === 'income' ? 'Receitas' : 'Despesas'
                    ]}
                    labelFormatter={(value) => {
                      const date = new Date(value + '-01');
                      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stackId="1"
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stackId="2"
                    stroke="#EF4444" 
                    fill="#EF4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedReport === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Despesas por Categoria</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {mockCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes por Categoria</h3>
              <div className="space-y-4">
                {mockCategoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{category.category}</p>
                        <p className="text-xs text-gray-500">{category.transactions} transações</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</p>
                      <p className="text-xs text-gray-500">{category.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'comparison' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Comparativo Anual</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMonthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatCurrency(value), 
                      name === 'currentYear' ? '2025' : '2024'
                    ]}
                  />
                  <Bar dataKey="previousYear" fill="#94A3B8" name="previousYear" />
                  <Bar dataKey="currentYear" fill="#3B82F6" name="currentYear" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Crescimento Médio</h4>
                <p className="text-lg font-bold text-blue-900">
                  {formatPercentage(mockMonthlyComparison.reduce((sum, item) => sum + item.growth, 0) / mockMonthlyComparison.length)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-1">Melhor Mês</h4>
                <p className="text-lg font-bold text-green-900">
                  {mockMonthlyComparison.reduce((best, item) => item.growth > best.growth ? item : best).month}
                </p>
                <p className="text-xs text-green-600">
                  {formatPercentage(Math.max(...mockMonthlyComparison.map(item => item.growth)))}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-800 mb-1">Total 2025</h4>
                <p className="text-lg font-bold text-purple-900">
                  {formatCurrency(mockMonthlyComparison.reduce((sum, item) => sum + item.currentYear, 0))}
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'cashflow' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fluxo de Caixa</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="period" 
                    tickFormatter={(value) => {
                      const date = new Date(value + '-01');
                      return date.toLocaleDateString('pt-BR', { month: 'short' });
                    }}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Saldo']}
                    labelFormatter={(value) => {
                      const date = new Date(value + '-01');
                      return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Quick Insights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Insights Rápidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Maior Receita</p>
                  <p className="text-lg font-bold text-blue-900">
                    {formatCurrency(Math.max(...reportData.map(item => item.income)))}
                  </p>
                  <p className="text-xs text-blue-600">Em março de 2025</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingDown className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm text-red-800 font-medium">Maior Despesa</p>
                  <p className="text-lg font-bold text-red-900">
                    {formatCurrency(Math.max(...reportData.map(item => item.expenses)))}
                  </p>
                  <p className="text-xs text-red-600">Em março de 2025</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-green-800 font-medium">Meta de Economia</p>
                  <p className="text-lg font-bold text-green-900">
                    {totals.savingsRate >= 20 ? '✓ Atingida' : '⚠ Abaixo'}
                  </p>
                  <p className="text-xs text-green-600">Meta: 20% | Atual: {totals.savingsRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recomendações</h3>
          <div className="space-y-3">
            {totals.savingsRate < 20 && (
              <div className="flex items-start">
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <Target className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Aumente sua taxa de poupança</p>
                  <p className="text-xs text-gray-600">
                    Sua taxa atual é {totals.savingsRate.toFixed(1)}%. Tente reduzir gastos em {mockCategoryData[0].category.toLowerCase()} para atingir a meta de 20%.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Diversifique seus investimentos</p>
                <p className="text-xs text-gray-600">
                  Considere aportar mensalmente em investimentos para fazer seu dinheiro crescer.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Controle de gastos com cartão</p>
                <p className="text-xs text-gray-600">
                  Monitore os gastos no cartão de crédito para evitar surpresas na fatura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

