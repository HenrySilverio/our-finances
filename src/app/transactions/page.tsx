'use client';

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Calendar,
  CreditCard,
  Wallet,
  X,
} from 'lucide-react';

// Defina uma interface para Transaction
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  transactionDate: string;
  account: { id: string; name: string; type: 'checking' | 'savings' } | null;
  creditCard: { id: string; name: string } | null;
}

export default function TransactionsPage() {
  const [showNewTransactionForm, setShowNewTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(
    'expense',
  );
  const [paymentMethod, setPaymentMethod] = useState<'account' | 'creditCard'>(
    'account',
  );

  // novo estado de transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const categories = ['Salário', 'Aluguel', 'Supermercado', 'Lazer', 'Transporte'];
  const accounts: { id: string; name: string; type: 'checking' | 'savings' }[] = [
    { id: 'acc1', name: 'Conta Corrente', type: 'checking' },
    { id: 'acc2', name: 'Poupança',      type: 'savings'  },
  ];
  const creditCards: { id: string; name: string }[] = [
    { id: 'cc1', name: 'Visa' },
    { id: 'cc2', name: 'Mastercard' },
    { id: 'cc3', name: 'American Express' },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const newTransaction: Transaction = {
    id: String(Date.now()),
    type: transactionType,
    category: form.get('category') as string,
    amount: parseFloat(form.get('amount') as string) || 0,
    description: form.get('description') as string,
    transactionDate: form.get('date') as string,
    account:
      paymentMethod === 'account'
        ? accounts.find((acc) => acc.id === form.get('account')) ?? null
        : null,
    creditCard:
      paymentMethod === 'creditCard'
        ? creditCards.find((cc) => cc.id === form.get('creditCard')) ?? null
        : null,
  };
  setTransactions((prev) => [newTransaction, ...prev]);
  setShowNewTransactionForm(false);
  e.currentTarget.reset();
};

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
            <p className="text-gray-600">Gerencie suas receitas e despesas</p>
          </div>
          <button
            onClick={() => setShowNewTransactionForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Nova Transação
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span>Período</span>
                <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                <Filter className="h-5 w-5 mr-2 text-gray-500" />
                <span>Filtros</span>
                <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* New Transaction Form */}
        {showNewTransactionForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Nova Transação
              </h3>
              <button
                onClick={() => setShowNewTransactionForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Transação
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setTransactionType('expense')}
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                      transactionType === 'expense'
                        ? 'bg-red-100 text-red-700 border-2 border-red-500'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    <ArrowDownRight
                      className={`h-5 w-5 mr-2 ${
                        transactionType === 'expense'
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                    Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('income')}
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                      transactionType === 'income'
                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    <ArrowUpRight
                      className={`h-5 w-5 mr-2 ${
                        transactionType === 'income'
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`}
                    />
                    Receita
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pagamento
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('account')}
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                      paymentMethod === 'account'
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    <Wallet
                      className={`h-5 w-5 mr-2 ${
                        paymentMethod === 'account'
                          ? 'text-blue-500'
                          : 'text-gray-400'
                      }`}
                    />
                    Conta
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('creditCard')}
                    className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                      paymentMethod === 'creditCard'
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    <CreditCard
                      className={`h-5 w-5 mr-2 ${
                        paymentMethod === 'creditCard'
                          ? 'text-purple-500'
                          : 'text-gray-400'
                      }`}
                    />
                    Cartão de Crédito
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Valor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">R$</span>
                  </div>
                  <input
                    name="amount"
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Categoria
                </label>
                <select
                  name="category"
                  id="category"
                  className="py-2 px-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account or Credit Card */}
              {paymentMethod === 'account' ? (
                <div>
                  <label
                    htmlFor="account"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Conta
                  </label>
                  <select
                    name="account"
                    id="account"
                    className="py-2 px-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Selecione uma conta</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} (
                        {account.type === 'checking' ? 'Corrente' : 'Poupança'})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="creditCard"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cartão de Crédito
                  </label>
                  <select
                    name="creditCard"
                    id="creditCard"
                    className="py-2 px-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione um cartão</option>
                    {creditCards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descrição
                </label>
                <input
                  name="description"
                  type="text"
                  id="description"
                  placeholder="Descrição da transação"
                  className="py-2 px-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Data
                </label>
                <input
                  name="date"
                  type="date"
                  id="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="py-2 px-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Salvar Transação
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conta/Cartão
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.transactionDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.account ? (
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{transaction.account.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1 text-purple-500" />
                        <span>{transaction.creditCard?.name}</span>
                      </div>
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{' '}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
