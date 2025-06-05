'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  BarChart3,
  PieChart,
  Calendar,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

// Interfaces
interface Investment {
  _id: string;
  name: string;
  type: 'stocks' | 'funds' | 'crypto' | 'pension' | 'bonds' | 'real_estate';
  ticker?: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  broker: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

interface PerformanceData {
  date: string;
  value: number;
  invested: number;
}

// Mock data
const mockInvestments: Investment[] = [
  {
    _id: '1',
    name: 'ITSA4',
    type: 'stocks',
    ticker: 'ITSA4',
    quantity: 100,
    averagePrice: 9.50,
    currentPrice: 10.20,
    totalInvested: 950,
    currentValue: 1020,
    profitLoss: 70,
    profitLossPercentage: 7.37,
    broker: 'Clear',
    purchaseDate: '2025-01-15',
    createdAt: '2025-01-15',
    updatedAt: '2025-06-04'
  },
  {
    _id: '2',
    name: 'HASH11',
    type: 'funds',
    ticker: 'HASH11',
    quantity: 50,
    averagePrice: 85.30,
    currentPrice: 92.15,
    totalInvested: 4265,
    currentValue: 4607.50,
    profitLoss: 342.50,
    profitLossPercentage: 8.03,
    broker: 'XP Investimentos',
    purchaseDate: '2025-02-10',
    createdAt: '2025-02-10',
    updatedAt: '2025-06-04'
  },
  {
    _id: '3',
    name: 'Bitcoin',
    type: 'crypto',
    quantity: 0.05,
    averagePrice: 280000,
    currentPrice: 320000,
    totalInvested: 14000,
    currentValue: 16000,
    profitLoss: 2000,
    profitLossPercentage: 14.29,
    broker: 'Binance',
    purchaseDate: '2025-03-05',
    createdAt: '2025-03-05',
    updatedAt: '2025-06-04'
  }
];

const mockPerformanceData: PerformanceData[] = [
  { date: '2025-01', value: 950, invested: 950 },
  { date: '2025-02', value: 4800, invested: 5215 },
  { date: '2025-03', value: 18500, invested: 19215 },
  { date: '2025-04', value: 19200, invested: 19215 },
  { date: '2025-05', value: 20800, invested: 19215 },
  { date: '2025-06', value: 21627.50, invested: 19215 }
];

const investmentTypes = [
  { value: 'stocks', label: 'Ações', color: '#3B82F6' },
  { value: 'funds', label: 'Fundos', color: '#10B981' },
  { value: 'crypto', label: 'Criptomoedas', color: '#F59E0B' },
  { value: 'pension', label: 'Previdência', color: '#8B5CF6' },
  { value: 'bonds', label: 'Títulos', color: '#EF4444' },
  { value: 'real_estate', label: 'Imóveis', color: '#06B6D4' }
];

const brokers = [
  'Clear', 'XP Investimentos', 'Rico', 'Inter', 'Nubank', 'BTG Pactual',
  'Binance', 'Mercado Bitcoin', 'NovaDAX', 'Outros'
];

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as Investment['type'],
    ticker: '',
    quantity: '',
    averagePrice: '',
    currentPrice: '',
    broker: '',
    purchaseDate: ''
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do investimento é obrigatório';
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantidade deve ser maior que zero';
    }

    if (!formData.averagePrice || parseFloat(formData.averagePrice) <= 0) {
      newErrors.averagePrice = 'Preço médio deve ser maior que zero';
    }

    if (!formData.currentPrice || parseFloat(formData.currentPrice) <= 0) {
      newErrors.currentPrice = 'Preço atual deve ser maior que zero';
    }

    if (!formData.broker.trim()) {
      newErrors.broker = 'Corretora é obrigatória';
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Data de compra é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateInvestmentData = (data: typeof formData) => {
    const quantity = parseFloat(data.quantity) || 0;
    const averagePrice = parseFloat(data.averagePrice) || 0;
    const currentPrice = parseFloat(data.currentPrice) || 0;
    
    const totalInvested = quantity * averagePrice;
    const currentValue = quantity * currentPrice;
    const profitLoss = currentValue - totalInvested;
    const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      profitLoss,
      profitLossPercentage
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const calculatedData = calculateInvestmentData(formData);
      
      const newInvestment: Investment = {
        _id: Date.now().toString(),
        name: formData.name.trim(),
        type: formData.type,
        ticker: formData.ticker.trim().toUpperCase() || undefined,
        quantity: parseFloat(formData.quantity),
        averagePrice: parseFloat(formData.averagePrice),
        currentPrice: parseFloat(formData.currentPrice),
        broker: formData.broker.trim(),
        purchaseDate: formData.purchaseDate,
        ...calculatedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing && selectedInvestment) {
        setInvestments(prev => prev.map(inv => 
          inv._id === selectedInvestment._id ? { ...newInvestment, _id: selectedInvestment._id } : inv
        ));
      } else {
        setInvestments(prev => [...prev, newInvestment]);
      }

      resetForm();
    } catch (error) {
      console.error('Erro ao salvar investimento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (investment: Investment) => {
    setSelectedInvestment(investment);
    setFormData({
      name: investment.name,
      type: investment.type,
      ticker: investment.ticker || '',
      quantity: investment.quantity.toString(),
      averagePrice: investment.averagePrice.toString(),
      currentPrice: investment.currentPrice.toString(),
      broker: investment.broker,
      purchaseDate: investment.purchaseDate
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (investmentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este investimento?')) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setInvestments(prev => prev.filter(inv => inv._id !== investmentId));
    } catch (error) {
      console.error('Erro ao excluir investimento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'stocks',
      ticker: '',
      quantity: '',
      averagePrice: '',
      currentPrice: '',
      broker: '',
      purchaseDate: ''
    });
    setSelectedInvestment(null);
    setIsEditing(false);
    setShowForm(false);
    setErrors({});
  };

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (investment.ticker && investment.ticker.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         investment.broker.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || investment.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Calculate totals
  const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  // Portfolio distribution
  const portfolioDistribution = investmentTypes.map(type => {
    const typeInvestments = investments.filter(inv => inv.type === type.value);
    const value = typeInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    return {
      name: type.label,
      value,
      color: type.color,
      percentage: totalCurrentValue > 0 ? (value / totalCurrentValue) * 100 : 0
    };
  }).filter(item => item.value > 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investimentos</h1>
            <p className="text-gray-600">Acompanhe sua carteira de investimentos</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPerformance(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <BarChart3 className="h-5 w-5 mr-1" />
              Performance
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus className="h-5 w-5 mr-1" />
              Novo Investimento
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Investido</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Atual</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${totalProfitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {totalProfitLoss >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lucro/Prejuízo</p>
                <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalProfitLoss)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${totalProfitLossPercentage >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <BarChart3 className={`h-6 w-6 ${totalProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rentabilidade</p>
                <p className={`text-2xl font-bold ${totalProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(totalProfitLossPercentage)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar investimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos os tipos</option>
                {investmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Portfolio Distribution */}
        {portfolioDistribution.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição da Carteira</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={portfolioDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {portfolioDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(item.value)}</p>
                      <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Investments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Meus Investimentos</h3>
          </div>
          
          {filteredInvestments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Investimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Médio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Atual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Investido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Atual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resultado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvestments.map((investment) => {
                    const typeInfo = investmentTypes.find(t => t.value === investment.type);
                    
                    return (
                      <tr key={investment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {investment.name}
                            </div>
                            {investment.ticker && (
                              <div className="text-sm text-gray-500">{investment.ticker}</div>
                            )}
                            <div className="text-xs text-gray-400">{investment.broker}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                            style={{ backgroundColor: typeInfo?.color }}
                          >
                            {typeInfo?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {investment.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(investment.averagePrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(investment.currentPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(investment.totalInvested)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(investment.currentValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            investment.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(investment.profitLoss)}
                          </div>
                          <div className={`text-xs ${
                            investment.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {formatPercentage(investment.profitLossPercentage)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(investment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(investment._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' ? 'Nenhum investimento encontrado' : 'Nenhum investimento cadastrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== 'all' ? 'Tente ajustar os filtros de busca' : 'Comece adicionando seu primeiro investimento'}
              </p>
              {!searchTerm && filterType === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Adicionar Investimento
                </button>
              )}
            </div>
          )}
        </div>

        {/* New/Edit Investment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditing ? 'Editar Investimento' : 'Novo Investimento'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Investment Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Investimento *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: ITSA4, Bitcoin, etc."
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Type */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                      </label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Investment['type'] }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {investmentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Ticker */}
                    <div>
                      <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-1">
                        Ticker/Código
                      </label>
                      <input
                        type="text"
                        id="ticker"
                        value={formData.ticker}
                        onChange={(e) => setFormData(prev => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: ITSA4, HASH11"
                      />
                    </div>

                    {/* Broker */}
                    <div>
                      <label htmlFor="broker" className="block text-sm font-medium text-gray-700 mb-1">
                        Corretora *
                      </label>
                      <select
                        id="broker"
                        value={formData.broker}
                        onChange={(e) => setFormData(prev => ({ ...prev, broker: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.broker ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Selecione uma corretora</option>
                        {brokers.map(broker => (
                          <option key={broker} value={broker}>{broker}</option>
                        ))}
                      </select>
                      {errors.broker && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.broker}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade *
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        step="0.00001"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0"
                      />
                      {errors.quantity && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.quantity}
                        </p>
                      )}
                    </div>

                    {/* Average Price */}
                    <div>
                      <label htmlFor="averagePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Médio *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">R$</span>
                        </div>
                        <input
                          type="number"
                          id="averagePrice"
                          step="0.01"
                          min="0"
                          value={formData.averagePrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, averagePrice: e.target.value }))}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.averagePrice ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0,00"
                        />
                      </div>
                      {errors.averagePrice && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.averagePrice}
                        </p>
                      )}
                    </div>

                    {/* Current Price */}
                    <div>
                      <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Atual *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">R$</span>
                        </div>
                        <input
                          type="number"
                          id="currentPrice"
                          step="0.01"
                          min="0"
                          value={formData.currentPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: e.target.value }))}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.currentPrice ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="0,00"
                        />
                      </div>
                      {errors.currentPrice && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.currentPrice}
                        </p>
                      )}
                    </div>

                    {/* Purchase Date */}
                    <div>
                      <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Compra *
                      </label>
                      <input
                        type="date"
                        id="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.purchaseDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.purchaseDate && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.purchaseDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Calculated Values Preview */}
                  {formData.quantity && formData.averagePrice && formData.currentPrice && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Resumo do Investimento</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {(() => {
                          const calc = calculateInvestmentData(formData);
                          return (
                            <>
                              <div>
                                <p className="text-gray-600">Total Investido</p>
                                <p className="font-medium">{formatCurrency(calc.totalInvested)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Valor Atual</p>
                                <p className="font-medium">{formatCurrency(calc.currentValue)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Resultado</p>
                                <p className={`font-medium ${calc.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(calc.profitLoss)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Rentabilidade</p>
                                <p className={`font-medium ${calc.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatPercentage(calc.profitLossPercentage)}
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isEditing ? 'Atualizar' : 'Salvar'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Performance Modal */}
        {showPerformance && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Performance da Carteira</h3>
                  <button
                    onClick={() => setShowPerformance(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          formatCurrency(value), 
                          name === 'value' ? 'Valor Atual' : 'Total Investido'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="invested" 
                        stroke="#6B7280" 
                        strokeWidth={2}
                        name="invested"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name="value"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Melhor Mês</h4>
                    <p className="text-lg font-bold text-blue-900">+12.5%</p>
                    <p className="text-xs text-blue-600">Maio 2025</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-1">Rentabilidade Acumulada</h4>
                    <p className="text-lg font-bold text-green-900">{formatPercentage(totalProfitLossPercentage)}</p>
                    <p className="text-xs text-green-600">Desde o início</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-800 mb-1">Tempo Médio</h4>
                    <p className="text-lg font-bold text-purple-900">4.2 meses</p>
                    <p className="text-xs text-purple-600">Por investimento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

