/**
 * Calcula o mês de competência da fatura do cartão de crédito
 * baseado na data da transação e no dia de fechamento
 * 
 * @param transactionDate Data da transação
 * @param closingDay Dia de fechamento do cartão (1-31)
 * @returns String no formato YYYY-MM representando o mês da fatura
 * 
 * Exemplo:
 * - Fechamento dia 10
 * - Compra em 09/junho → fatura de junho
 * - Compra em 11/junho → fatura de julho
 */
export function calculateInvoiceMonth(transactionDate: Date, closingDay: number): string {
  const date = new Date(transactionDate);
  const closingDate = new Date(date.getFullYear(), date.getMonth(), closingDay);

  if (date <= closingDate) {
    // Transação antes ou no dia de fechamento - vai para fatura do mês atual
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  } else {
    // Transação após o fechamento - vai para fatura do próximo mês
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
  }
}

/**
 * Formata valor monetário para exibição
 * @param value Valor numérico
 * @param currency Código da moeda (padrão: BRL)
 * @returns String formatada
 */
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Formata data para exibição
 * @param date Data a ser formatada
 * @returns String no formato DD/MM/YYYY
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Formata data para input HTML
 * @param date Data a ser formatada
 * @returns String no formato YYYY-MM-DD
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Converte string de data do input HTML para Date
 * @param dateString String no formato YYYY-MM-DD
 * @returns Objeto Date
 */
export function parseInputDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00.000Z');
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param startDate Data inicial
 * @param endDate Data final
 * @returns Número de dias
 */
export function daysDifference(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Obtém o primeiro e último dia do mês
 * @param year Ano
 * @param month Mês (1-12)
 * @returns Objeto com firstDay e lastDay
 */
export function getMonthRange(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  return { firstDay, lastDay };
}

/**
 * Valida se uma string está no formato YYYY-MM
 * @param monthString String a ser validada
 * @returns Boolean indicando se é válida
 */
export function isValidMonthFormat(monthString: string): boolean {
  return /^\d{4}-\d{2}$/.test(monthString);
}

