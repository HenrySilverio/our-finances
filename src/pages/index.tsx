import React from 'react';
import { Header } from '../components/Header.component';
import { Dashboard } from '../components/Dashboard.component';
import { BillingClosingConfig } from '../components/BillingClosingConfig.component';
import { MonthlyReport } from '../components/MonthlyReport.component';
import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [creditCards, setCreditCards] = useState([]);
  const [closingDates, setClosingDates] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados de exemplo para o dashboard
  const dashboardData = {
    balanceData: {
      totalBalance: 5280.75,
      income: 8500.00,
      expenses: 3219.25,
      savingsGoal: 2000,
      savingsProgress: 1500,
    },
    recentTransactions: [
      { id: '1', description: 'Salário', amount: 8500, date: '2025-05-05', category: 'Receita', isExpense: false },
      { id: '2', description: 'Aluguel', amount: 1800, date: '2025-05-10', category: 'Moradia', isExpense: true },
      { id: '3', description: 'Supermercado', amount: 650.75, date: '2025-05-15', category: 'Alimentação', isExpense: true },
      { id: '4', description: 'Internet', amount: 120, date: '2025-05-18', category: 'Serviços', isExpense: true },
      { id: '5', description: 'Investimento', amount: 1500, date: '2025-05-20', category: 'Poupança', isExpense: false },
    ],
    expensesByCategory: [
      { category: 'Moradia', amount: 1800, color: '#4285f4' },
      { category: 'Alimentação', amount: 650.75, color: '#ea4335' },
      { category: 'Serviços', amount: 450, color: '#fbbc05' },
      { category: 'Transporte', amount: 320, color: '#34a853' },
    ],
    incomeVsExpenseData: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      incomeData: [7800, 7800, 8200, 8200, 8500],
      expenseData: [3500, 3200, 3800, 3400, 3219.25],
    },
  };
  
  // Carregar cartões e datas de fechamento
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardsResponse = await fetch('/api/credit-cards');
        if (cardsResponse.ok) {
          const cardsData = await cardsResponse.json();
          setCreditCards(cardsData);
        }
        
        const datesResponse = await fetch('/api/billing-settings');
        if (datesResponse.ok) {
          const datesData = await datesResponse.json();
          setClosingDates(datesData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSaveClosingDate = async (data) => {
    try {
      const response = await fetch('/api/billing-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const updatedDates = await response.json();
        setClosingDates(updatedDates);
      }
    } catch (error) {
      console.error('Erro ao salvar data de fechamento:', error);
    }
  };
  
  const handleGenerateReport = async (month, year) => {
    setIsLoading(true);
    
    try {
      // Em um ambiente real, isso seria uma chamada à API
      // const response = await fetch(`/api/reports/monthly?month=${month}&year=${year}`);
      // const data = await response.json();
      
      // Simulando dados de relatório para demonstração
      setTimeout(() => {
        setReportData({
          month,
          year,
          income: 8500,
          totalExpenses: 3219.25,
          savings: 1500,
          expenses: [
            { category: { _id: '1', name: 'Moradia', color: '#4285f4' }, amount: 1800, percentage: 55.9 },
            { category: { _id: '2', name: 'Alimentação', color: '#ea4335' }, amount: 650.75, percentage: 20.2 },
            { category: { _id: '3', name: 'Serviços', color: '#fbbc05' }, amount: 450, percentage: 14.0 },
            { category: { _id: '4', name: 'Transporte', color: '#34a853' }, amount: 320, percentage: 9.9 },
          ],
          previousMonthComparison: {
            expensesDiff: -5.2,
            savingsDiff: 12.5
          },
          recommendations: [
            "Sua taxa de economia está boa, mas considere aumentar para 20% para objetivos de longo prazo.",
            "Parabéns! Você reduziu seus gastos em 5.2% em relação ao mês anterior."
          ]
        });
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <Header 
        title="Our Finances" 
        navItems={[
          { label: 'Dashboard', href: '#dashboard', active: activeTab === 'dashboard', onClick: () => setActiveTab('dashboard') },
          { label: 'Fechamento', href: '#billing', active: activeTab === 'billing', onClick: () => setActiveTab('billing') },
          { label: 'Relatórios', href: '#reports', active: activeTab === 'reports', onClick: () => setActiveTab('reports') },
        ]}
        userName="Casal Finanças"
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            balanceData={dashboardData.balanceData}
            recentTransactions={dashboardData.recentTransactions}
            expensesByCategory={dashboardData.expensesByCategory}
            incomeVsExpenseData={dashboardData.incomeVsExpenseData}
            onAddTransaction={() => console.log('Adicionar transação')}
            onViewAllTransactions={() => console.log('Ver todas as transações')}
            currency="R$"
          />
        )}
        
        {activeTab === 'billing' && (
          <BillingClosingConfig
            creditCards={creditCards}
            existingClosingDates={closingDates}
            onSaveClosingDate={handleSaveClosingDate}
          />
        )}
        
        {activeTab === 'reports' && (
          <MonthlyReport
            month={reportData?.month || new Date().getMonth()}
            year={reportData?.year || new Date().getFullYear()}
            expenses={reportData?.expenses || []}
            income={reportData?.income || 0}
            totalExpenses={reportData?.totalExpenses || 0}
            savings={reportData?.savings || 0}
            previousMonthComparison={reportData?.previousMonthComparison}
            recommendations={reportData?.recommendations || []}
            onGenerateReport={handleGenerateReport}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}
