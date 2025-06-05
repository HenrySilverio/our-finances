'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  CreditCard,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  TrendingUp
} from 'lucide-react';

// Interfaces
interface CreditCard {
  _id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  currentInvoiceMonth: string;
  brand: string;
  lastFourDigits: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  month: string;
  total: number;
  transactions: number;
  status: 'pending' | 'paid' | 'overdue';
}

// Mock data - em produção viria da API
const mockCreditCards: CreditCard[] = [
  {
    _id: '1',
    name: 'Nubank Roxinho',
    limit: 5000,
    closingDay: 10,
    dueDay: 17,
    currentInvoiceMonth: '2025-06',
    brand: 'Mastercard',
    lastFourDigits: '1234',
    color: '#8A05BE',
    createdAt: '2025-01-15',
    updatedAt: '2025-06-01'
  },
  {
    _id: '2',
    name: 'Itaú Visa Gold',
    limit: 8000,
    closingDay: 5,
    dueDay: 15,
    currentInvoiceMonth: '2025-06',
    brand: 'Visa',
    lastFourDigits: '5678',
    color: '#FF6B00',
    createdAt: '2025-02-20',
    updatedAt: '2025-06-01'
  }
];

const mockInvoices: Record<string, Invoice[]> = {
  '1': [
    { month: '2025-06', total: 1250.80, transactions: 15, status: 'pending' },
    { month: '2025-05', total: 980.45, transactions: 12, status: 'paid' },
    { month: '2025-04', total: 1450.20, transactions: 18, status: 'paid' }
  ],
  '2': [
    { month: '2025-06', total: 2100.30, transactions: 22, status: 'pending' },
    { month: '2025-05', total: 1800.75, transactions: 19, status: 'paid' },
    { month: '2025-04', total: 2250.90, transactions: 25, status: 'paid' }
  ]
};

export default function CreditCardsPage() {
  const [creditCards, setCreditCards] = useState<CreditCard[]>(mockCreditCards);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    closingDay: '',
    dueDay: '',
    brand: 'Mastercard',
    lastFourDigits: '',
    color: '#3B82F6'
  });

  const brands = ['Mastercard', 'Visa', 'American Express', 'Elo', 'Hipercard'];
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do cartão é obrigatório';
    }

    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      newErrors.limit = 'Limite deve ser maior que zero';
    }

    if (!formData.closingDay || parseInt(formData.closingDay) < 1 || parseInt(formData.closingDay) > 31) {
      newErrors.closingDay = 'Dia de fechamento deve ser entre 1 e 31';
    }

    if (!formData.dueDay || parseInt(formData.dueDay) < 1 || parseInt(formData.dueDay) > 31) {
      newErrors.dueDay = 'Dia de vencimento deve ser entre 1 e 31';
    }

    if (!formData.lastFourDigits || formData.lastFourDigits.length !== 4 || !/^\d{4}$/.test(formData.lastFourDigits)) {
      newErrors.lastFourDigits = 'Últimos 4 dígitos devem conter exatamente 4 números';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCard: CreditCard = {
        _id: Date.now().toString(),
        name: formData.name.trim(),
        limit: parseFloat(formData.limit),
        closingDay: parseInt(formData.closingDay),
        dueDay: parseInt(formData.dueDay),
        currentInvoiceMonth: '2025-06',
        brand: formData.brand,
        lastFourDigits: formData.lastFourDigits,
        color: formData.color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing && selectedCard) {
        setCreditCards(prev => prev.map(card => 
          card._id === selectedCard._id ? { ...newCard, _id: selectedCard._id } : card
        ));
      } else {
        setCreditCards(prev => [...prev, newCard]);
      }

      resetForm();
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (card: CreditCard) => {
    setSelectedCard(card);
    setFormData({
      name: card.name,
      limit: card.limit.toString(),
      closingDay: card.closingDay.toString(),
      dueDay: card.dueDay.toString(),
      brand: card.brand,
      lastFourDigits: card.lastFourDigits,
      color: card.color
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (cardId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cartão?')) return;

    setIsLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCreditCards(prev => prev.filter(card => card._id !== cardId));
    } catch (error) {
      console.error('Erro ao excluir cartão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      limit: '',
      closingDay: '',
      dueDay: '',
      brand: 'Mastercard',
      lastFourDigits: '',
      color: '#3B82F6'
    });
    setSelectedCard(null);
    setIsEditing(false);
    setShowForm(false);
    setErrors({});
  };

  const filteredCards = creditCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUsagePercentage = (cardId: string) => {
    const invoices = mockInvoices[cardId] || [];
    const currentInvoice = invoices.find(inv => inv.month === '2025-06');
    const card = creditCards.find(c => c._id === cardId);
    
    if (!currentInvoice || !card) return 0;
    return (currentInvoice.total / card.limit) * 100;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cartões de Crédito</h1>
            <p className="text-gray-600">Gerencie seus cartões e acompanhe as faturas</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Novo Cartão
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar cartões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Credit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => {
            const usagePercentage = getUsagePercentage(card._id);
            const currentInvoice = mockInvoices[card._id]?.find(inv => inv.month === '2025-06');
            
            return (
              <div key={card._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Card Visual */}
                <div 
                  className="h-48 p-6 text-white relative"
                  style={{ backgroundColor: card.color }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm opacity-90">{card.brand}</p>
                      <h3 className="text-lg font-semibold mt-1">{card.name}</h3>
                    </div>
                    <CreditCard className="h-8 w-8 opacity-80" />
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-75">**** **** **** {card.lastFourDigits}</p>
                        <p className="text-sm mt-1">Limite: {formatCurrency(card.limit)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-75">Fecha dia {card.closingDay}</p>
                        <p className="text-xs opacity-75">Vence dia {card.dueDay}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4">
                  {/* Usage Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Fatura Atual</span>
                      <span>{formatCurrency(currentInvoice?.total || 0)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          usagePercentage > 80 ? 'bg-red-500' : 
                          usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {usagePercentage.toFixed(1)}% do limite utilizado
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setSelectedCard(card);
                        setShowInvoices(true);
                      }}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Faturas
                    </button>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(card)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(card._id)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum cartão encontrado' : 'Nenhum cartão cadastrado'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece adicionando seu primeiro cartão de crédito'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Adicionar Cartão
              </button>
            )}
          </div>
        )}

        {/* New/Edit Card Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditing ? 'Editar Cartão' : 'Novo Cartão'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Card Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Cartão *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Nubank Roxinho"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Brand */}
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Bandeira *
                    </label>
                    <select
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Last Four Digits */}
                  <div>
                    <label htmlFor="lastFourDigits" className="block text-sm font-medium text-gray-700 mb-1">
                      Últimos 4 Dígitos *
                    </label>
                    <input
                      type="text"
                      id="lastFourDigits"
                      value={formData.lastFourDigits}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setFormData(prev => ({ ...prev, lastFourDigits: value }));
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.lastFourDigits ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234"
                      maxLength={4}
                    />
                    {errors.lastFourDigits && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.lastFourDigits}
                      </p>
                    )}
                  </div>

                  {/* Limit */}
                  <div>
                    <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                      Limite *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">R$</span>
                      </div>
                      <input
                        type="number"
                        id="limit"
                        step="0.01"
                        min="0"
                        value={formData.limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, limit: e.target.value }))}
                        className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.limit ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0,00"
                      />
                    </div>
                    {errors.limit && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.limit}
                      </p>
                    )}
                  </div>

                  {/* Closing and Due Days */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="closingDay" className="block text-sm font-medium text-gray-700 mb-1">
                        Dia Fechamento *
                      </label>
                      <input
                        type="number"
                        id="closingDay"
                        min="1"
                        max="31"
                        value={formData.closingDay}
                        onChange={(e) => setFormData(prev => ({ ...prev, closingDay: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.closingDay ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="10"
                      />
                      {errors.closingDay && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.closingDay}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="dueDay" className="block text-sm font-medium text-gray-700 mb-1">
                        Dia Vencimento *
                      </label>
                      <input
                        type="number"
                        id="dueDay"
                        min="1"
                        max="31"
                        value={formData.dueDay}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDay: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.dueDay ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="17"
                      />
                      {errors.dueDay && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dueDay}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor do Cartão
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

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

        {/* Invoices Modal */}
        {showInvoices && selectedCard && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Faturas - {selectedCard.name}
                  </h3>
                  <button
                    onClick={() => setShowInvoices(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {mockInvoices[selectedCard._id]?.map((invoice, index) => (
                    <div key={invoice.month} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {new Date(invoice.month + '-01').toLocaleDateString('pt-BR', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {invoice.transactions} transações
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(invoice.total)}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invoice.status === 'paid' ? 'Paga' :
                             invoice.status === 'overdue' ? 'Vencida' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

