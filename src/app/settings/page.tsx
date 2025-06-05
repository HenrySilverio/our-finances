'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Target,
  Download,
  Upload,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Settings,
  Heart,
  LogOut,
  RefreshCw
} from 'lucide-react';

// Interfaces
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  partnerEmail: string;
  profilePicture?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  budgetAlerts: boolean;
  billReminders: boolean;
  investmentUpdates: boolean;
  partnerTransactions: boolean;
}

interface AppPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  currency: 'BRL' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  startOfWeek: 'sunday' | 'monday';
  defaultTransactionType: 'expense' | 'income';
}

interface BudgetGoals {
  monthlyIncomeGoal: number;
  monthlySavingsGoal: number;
  savingsPercentageGoal: number;
  emergencyFundGoal: number;
  investmentGoal: number;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [profile, setProfile] = useState<UserProfile>({
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15',
    partnerEmail: 'maria@email.com'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    budgetAlerts: true,
    billReminders: true,
    investmentUpdates: false,
    partnerTransactions: true
  });

  const [preferences, setPreferences] = useState<AppPreferences>({
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    startOfWeek: 'monday',
    defaultTransactionType: 'expense'
  });

  const [budgetGoals, setBudgetGoals] = useState<BudgetGoals>({
    monthlyIncomeGoal: 10000,
    monthlySavingsGoal: 2000,
    savingsPercentageGoal: 20,
    emergencyFundGoal: 30000,
    investmentGoal: 50000
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'preferences', label: 'Preferências', icon: Settings },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'data', label: 'Dados', icon: Download }
  ];

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!profile.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email inválido';
    }

    if (profile.partnerEmail && !/\S+@\S+\.\S+/.test(profile.partnerEmail)) {
      newErrors.partnerEmail = 'Email do parceiro inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Configurações de notificação salvas!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Preferências salvas!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGoals = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Metas financeiras salvas!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar metas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Senha alterada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simular download
      const filename = `our-finances-backup-${Date.now()}.json`;
      console.log(`Exportando dados: ${filename}`);
      setSuccessMessage('Dados exportados com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Informações do Perfil</h3>
                  
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                      <div>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600">
                          Alterar Foto
                        </button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG até 2MB</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Birth Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          value={profile.birthDate}
                          onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Partner Email */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email do Parceiro(a)
                        </label>
                        <input
                          type="email"
                          value={profile.partnerEmail}
                          onChange={(e) => setProfile(prev => ({ ...prev, partnerEmail: e.target.value }))}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.partnerEmail ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Email do seu parceiro para compartilhar finanças"
                        />
                        {errors.partnerEmail && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.partnerEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Perfil
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Configurações de Notificação</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-800">Canais de Notificação</h4>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) => setNotifications(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Notificações por email</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.pushNotifications}
                            onChange={(e) => setNotifications(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Notificações push</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-800">Relatórios</h4>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.weeklyReports}
                            onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Relatório semanal</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.monthlyReports}
                            onChange={(e) => setNotifications(prev => ({ ...prev, monthlyReports: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Relatório mensal</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-800">Alertas</h4>
                      
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.budgetAlerts}
                            onChange={(e) => setNotifications(prev => ({ ...prev, budgetAlerts: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Alertas de orçamento</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.billReminders}
                            onChange={(e) => setNotifications(prev => ({ ...prev, billReminders: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Lembretes de contas</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.investmentUpdates}
                            onChange={(e) => setNotifications(prev => ({ ...prev, investmentUpdates: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Atualizações de investimentos</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={notifications.partnerTransactions}
                            onChange={(e) => setNotifications(prev => ({ ...prev, partnerTransactions: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">Transações do parceiro</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNotifications}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Notificações
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Preferências do Aplicativo</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Theme */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tema
                        </label>
                        <select
                          value={preferences.theme}
                          onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as AppPreferences['theme'] }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="light">Claro</option>
                          <option value="dark">Escuro</option>
                          <option value="auto">Automático</option>
                        </select>
                      </div>

                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Idioma
                        </label>
                        <select
                          value={preferences.language}
                          onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value as AppPreferences['language'] }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="pt-BR">Português (Brasil)</option>
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Español</option>
                        </select>
                      </div>

                      {/* Currency */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moeda
                        </label>
                        <select
                          value={preferences.currency}
                          onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value as AppPreferences['currency'] }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="BRL">Real (R$)</option>
                          <option value="USD">Dólar ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>

                      {/* Date Format */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Formato de Data
                        </label>
                        <select
                          value={preferences.dateFormat}
                          onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value as AppPreferences['dateFormat'] }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      {/* Start of Week */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Início da Semana
                        </label>
                        <select
                          value={preferences.startOfWeek}
                          onChange={(e) => setPreferences(prev => ({ ...prev, startOfWeek: e.target.value as AppPreferences['startOfWeek'] }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="sunday">Domingo</option>
                          <option value="monday">Segunda-feira</option>
                        </select>
                      </div>

                      {/* Default Transaction Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Transação Padrão
                        </label>
                        <select
                          value={preferences.defaultTransactionType}
                          onChange={(e) => setPreferences(prev => ({ ...prev, defaultTransactionType: e.target.value as AppPreferences['defaultTransactionType'] }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="expense">Despesa</option>
                          <option value="income">Receita</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSavePreferences}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Preferências
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Goals Tab */}
              {activeTab === 'goals' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Metas Financeiras</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Monthly Income Goal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta de Receita Mensal
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">R$</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={budgetGoals.monthlyIncomeGoal}
                            onChange={(e) => setBudgetGoals(prev => ({ ...prev, monthlyIncomeGoal: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Monthly Savings Goal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta de Economia Mensal
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">R$</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={budgetGoals.monthlySavingsGoal}
                            onChange={(e) => setBudgetGoals(prev => ({ ...prev, monthlySavingsGoal: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Savings Percentage Goal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta de % de Economia
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={budgetGoals.savingsPercentageGoal}
                            onChange={(e) => setBudgetGoals(prev => ({ ...prev, savingsPercentageGoal: parseFloat(e.target.value) || 0 }))}
                            className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">%</span>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Fund Goal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta de Reserva de Emergência
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">R$</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={budgetGoals.emergencyFundGoal}
                            onChange={(e) => setBudgetGoals(prev => ({ ...prev, emergencyFundGoal: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Investment Goal */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meta de Investimentos
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">R$</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={budgetGoals.investmentGoal}
                            onChange={(e) => setBudgetGoals(prev => ({ ...prev, investmentGoal: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Goals Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Resumo das Metas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Receita Mensal</p>
                          <p className="font-medium">{formatCurrency(budgetGoals.monthlyIncomeGoal)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Economia Mensal</p>
                          <p className="font-medium">{formatCurrency(budgetGoals.monthlySavingsGoal)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Taxa de Economia</p>
                          <p className="font-medium">{budgetGoals.savingsPercentageGoal}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveGoals}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Metas
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Segurança</h3>
                  
                  <div className="space-y-6">
                    {/* Change Password */}
                    <div className="border rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-4">Alterar Senha</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha Atual *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {errors.currentPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.currentPassword}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nova Senha *
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.newPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.newPassword}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Nova Senha *
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={handleChangePassword}
                          disabled={isLoading}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Alterando...
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Alterar Senha
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Autenticação de Dois Fatores</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Adicione uma camada extra de segurança à sua conta
                      </p>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm">
                        Configurar 2FA
                      </button>
                    </div>

                    {/* Active Sessions */}
                    <div className="border rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-4">Sessões Ativas</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Navegador atual</p>
                            <p className="text-xs text-gray-500">Chrome • São Paulo, Brasil</p>
                          </div>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Ativo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Tab */}
              {activeTab === 'data' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Gerenciamento de Dados</h3>
                  
                  <div className="space-y-6">
                    {/* Export Data */}
                    <div className="border rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Exportar Dados</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Baixe uma cópia de todos os seus dados financeiros
                      </p>
                      <button
                        onClick={handleExportData}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Exportando...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar Dados
                          </>
                        )}
                      </button>
                    </div>

                    {/* Import Data */}
                    <div className="border rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Importar Dados</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Importe dados de outros aplicativos financeiros
                      </p>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Importar Dados
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="border border-red-200 rounded-lg p-4">
                      <h4 className="text-md font-medium text-red-800 mb-2">Excluir Conta</h4>
                      <p className="text-sm text-red-600 mb-4">
                        Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
                      </p>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Conta
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

