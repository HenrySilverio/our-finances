// Global state management using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  partnerEmail?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  _id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  bank: string;
  balance: number;
  initialBalance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditCard {
  _id: string;
  name: string;
  bank: string;
  limit: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  lastFourDigits: string;
  currentInvoiceMonth: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  accountId?: string;
  creditCardId?: string;
  invoiceMonth?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
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
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  currency: 'BRL' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
    budgetAlerts: boolean;
    billReminders: boolean;
    investmentUpdates: boolean;
    partnerTransactions: boolean;
  };
  budgetGoals: {
    monthlyIncomeGoal: number;
    monthlySavingsGoal: number;
    savingsPercentageGoal: number;
    emergencyFundGoal: number;
    investmentGoal: number;
  };
}

// Store interfaces
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface DataStore {
  accounts: Account[];
  creditCards: CreditCard[];
  transactions: Transaction[];
  investments: Investment[];
  isLoading: boolean;
  lastUpdated: string | null;
  
  // Actions
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  setCreditCards: (creditCards: CreditCard[]) => void;
  addCreditCard: (creditCard: CreditCard) => void;
  updateCreditCard: (id: string, creditCard: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;
  
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  setInvestments: (investments: Investment[]) => void;
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  
  setLoading: (loading: boolean) => void;
  refreshData: () => Promise<void>;
  clearData: () => void;
}

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'pt-BR',
  currency: 'BRL',
  dateFormat: 'DD/MM/YYYY',
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    budgetAlerts: true,
    billReminders: true,
    investmentUpdates: false,
    partnerTransactions: true,
  },
  budgetGoals: {
    monthlyIncomeGoal: 10000,
    monthlySavingsGoal: 2000,
    savingsPercentageGoal: 20,
    emergencyFundGoal: 30000,
    investmentGoal: 50000,
  },
};

// User store
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Data store
export const useDataStore = create<DataStore>()((set, get) => ({
  accounts: [],
  creditCards: [],
  transactions: [],
  investments: [],
  isLoading: false,
  lastUpdated: null,
  
  setAccounts: (accounts) => set({ accounts, lastUpdated: new Date().toISOString() }),
  addAccount: (account) => set((state) => ({ 
    accounts: [...state.accounts, account],
    lastUpdated: new Date().toISOString()
  })),
  updateAccount: (id, accountUpdate) => set((state) => ({
    accounts: state.accounts.map(account => 
      account._id === id ? { ...account, ...accountUpdate } : account
    ),
    lastUpdated: new Date().toISOString()
  })),
  deleteAccount: (id) => set((state) => ({
    accounts: state.accounts.filter(account => account._id !== id),
    lastUpdated: new Date().toISOString()
  })),
  
  setCreditCards: (creditCards) => set({ creditCards, lastUpdated: new Date().toISOString() }),
  addCreditCard: (creditCard) => set((state) => ({ 
    creditCards: [...state.creditCards, creditCard],
    lastUpdated: new Date().toISOString()
  })),
  updateCreditCard: (id, creditCardUpdate) => set((state) => ({
    creditCards: state.creditCards.map(card => 
      card._id === id ? { ...card, ...creditCardUpdate } : card
    ),
    lastUpdated: new Date().toISOString()
  })),
  deleteCreditCard: (id) => set((state) => ({
    creditCards: state.creditCards.filter(card => card._id !== id),
    lastUpdated: new Date().toISOString()
  })),
  
  setTransactions: (transactions) => set({ transactions, lastUpdated: new Date().toISOString() }),
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [...state.transactions, transaction],
    lastUpdated: new Date().toISOString()
  })),
  updateTransaction: (id, transactionUpdate) => set((state) => ({
    transactions: state.transactions.map(transaction => 
      transaction._id === id ? { ...transaction, ...transactionUpdate } : transaction
    ),
    lastUpdated: new Date().toISOString()
  })),
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(transaction => transaction._id !== id),
    lastUpdated: new Date().toISOString()
  })),
  
  setInvestments: (investments) => set({ investments, lastUpdated: new Date().toISOString() }),
  addInvestment: (investment) => set((state) => ({ 
    investments: [...state.investments, investment],
    lastUpdated: new Date().toISOString()
  })),
  updateInvestment: (id, investmentUpdate) => set((state) => ({
    investments: state.investments.map(investment => 
      investment._id === id ? { ...investment, ...investmentUpdate } : investment
    ),
    lastUpdated: new Date().toISOString()
  })),
  deleteInvestment: (id) => set((state) => ({
    investments: state.investments.filter(investment => investment._id !== id),
    lastUpdated: new Date().toISOString()
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  refreshData: async () => {
    set({ isLoading: true });
    try {
      // In a real app, these would be API calls
      // For now, we'll just simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data would be fetched here
      set({ lastUpdated: new Date().toISOString() });
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearData: () => set({
    accounts: [],
    creditCards: [],
    transactions: [],
    investments: [],
    lastUpdated: null
  }),
}));

// Settings store
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateSettings: (settingsUpdate) => set((state) => ({
        settings: { ...state.settings, ...settingsUpdate }
      })),
      
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'settings-storage',
    }
  )
);

// Computed values and selectors
export const useFinancialSummary = () => {
  const { accounts, transactions, investments } = useDataStore();
  
  // Calculate totals
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const currentDate = new Date();
    return transactionDate.getMonth() === currentDate.getMonth() &&
           transactionDate.getFullYear() === currentDate.getFullYear();
  });
  
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyBalance = monthlyIncome - monthlyExpenses;
  
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalInvested = investments.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const investmentProfitLoss = totalInvestments - totalInvested;
  
  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    monthlyBalance,
    totalInvestments,
    totalInvested,
    investmentProfitLoss,
    savingsRate: monthlyIncome > 0 ? (monthlyBalance / monthlyIncome) * 100 : 0,
  };
};

export const useTransactionsByCategory = () => {
  const { transactions } = useDataStore();
  
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 };
      }
      acc[category].total += transaction.amount;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);
    
  return Object.entries(expensesByCategory).map(([category, data]) => ({
    category,
    amount: data.total,
    count: data.count,
    percentage: 0 // Will be calculated by the component
  }));
};

export const useCreditCardSummary = () => {
  const { creditCards, transactions } = useDataStore();
  
  return creditCards.map(card => {
    const cardTransactions = transactions.filter(t => t.creditCardId === card._id);
    const currentInvoiceTransactions = cardTransactions.filter(t => 
      t.invoiceMonth === card.currentInvoiceMonth
    );
    
    const currentInvoiceAmount = currentInvoiceTransactions
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      ...card,
      currentInvoiceAmount,
      availableLimit: card.limit - currentInvoiceAmount,
      utilizationPercentage: (currentInvoiceAmount / card.limit) * 100,
    };
  });
};

// API integration helpers
export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  async put(endpoint: string, data: any) {
    const response = await fetch(`/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  async delete(endpoint: string) {
    const response = await fetch(`/api${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
};

// Data synchronization hooks
export const useSyncData = () => {
  const { refreshData } = useDataStore();
  const { user } = useUserStore();
  
  React.useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user, refreshData]);
};

// Export all stores for easy access
export { useUserStore as useUser, useDataStore as useData, useSettingsStore as useSettings };

