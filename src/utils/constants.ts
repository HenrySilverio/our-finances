/**
 * Categorias padrão para transações
 */
export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Roupas',
  'Tecnologia',
  'Serviços',
  'Outros',
] as const;

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Vendas',
  'Outros',
] as const;

/**
 * Tipos de conta
 */
export const ACCOUNT_TYPES = {
  checking: 'Conta Corrente',
  savings: 'Poupança',
  investment: 'Investimento',
  cash: 'Dinheiro',
} as const;

/**
 * Tipos de investimento
 */
export const INVESTMENT_TYPES = {
  stock: 'Ações',
  fund: 'Fundos',
  crypto: 'Criptomoedas',
  pension: 'Previdência',
} as const;

/**
 * Valida email
 * @param email Email a ser validado
 * @returns Boolean indicando se é válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha (mínimo 8 caracteres, pelo menos 1 número e 1 letra)
 * @param password Senha a ser validada
 * @returns Boolean indicando se é válida
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Calcula o total de transações por tipo
 * @param transactions Array de transações
 * @param type Tipo de transação ('income' ou 'expense')
 * @returns Valor total
 */
export function calculateTotalByType(
  transactions: Array<{ type: string; amount: number }>,
  type: 'income' | 'expense'
): number {
  return transactions
    .filter(t => t.type === type)
    .reduce((total, t) => total + t.amount, 0);
}

/**
 * Agrupa transações por categoria
 * @param transactions Array de transações
 * @returns Objeto com categorias como chaves e totais como valores
 */
export function groupTransactionsByCategory(
  transactions: Array<{ category: string; amount: number }>
): Record<string, number> {
  return transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calcula saldo líquido (receitas - despesas)
 * @param transactions Array de transações
 * @returns Saldo líquido
 */
export function calculateNetBalance(
  transactions: Array<{ type: string; amount: number }>
): number {
  const income = calculateTotalByType(transactions, 'income');
  const expenses = calculateTotalByType(transactions, 'expense');
  return income - expenses;
}

/**
 * Gera cores para gráficos
 * @param count Número de cores necessárias
 * @returns Array de cores em formato hex
 */
export function generateChartColors(count: number): string[] {
  const colors = [
    '#3B82F6', // blue-500
    '#EF4444', // red-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#8B5CF6', // violet-500
    '#06B6D4', // cyan-500
    '#F97316', // orange-500
    '#84CC16', // lime-500
    '#EC4899', // pink-500
    '#6B7280', // gray-500
  ];
  
  // Se precisar de mais cores, gera cores aleatórias
  while (colors.length < count) {
    const hue = Math.floor(Math.random() * 360);
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  
  return colors.slice(0, count);
}

/**
 * Formata número para exibição compacta (1K, 1M, etc.)
 * @param value Valor numérico
 * @returns String formatada
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}

