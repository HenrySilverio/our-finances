// Validation utilities for form inputs and API requests

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates a single field against its rules
 */
export function validateField(value: any, rules: ValidationRule, fieldName: string): string | null {
  // Required validation
  if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
    return `${fieldName} é obrigatório`;
  }

  // Skip other validations if field is empty and not required
  if (!value && !rules.required) {
    return null;
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `${fieldName} deve ter pelo menos ${rules.minLength} caracteres`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${fieldName} deve ter no máximo ${rules.maxLength} caracteres`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return `${fieldName} tem formato inválido`;
    }
  }

  // Number validations
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value);
    
    if (rules.min !== undefined && numValue < rules.min) {
      return `${fieldName} deve ser maior ou igual a ${rules.min}`;
    }

    if (rules.max !== undefined && numValue > rules.max) {
      return `${fieldName} deve ser menor ou igual a ${rules.max}`;
    }
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

/**
 * Validates an object against a schema
 */
export function validateSchema(data: Record<string, any>, schema: ValidationSchema): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [fieldName, rules] of Object.entries(schema)) {
    const value = data[fieldName];
    const error = validateField(value, rules, fieldName);
    
    if (error) {
      errors[fieldName] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  cep: /^\d{5}-\d{3}$/,
  creditCard: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Predefined validation schemas
export const TransactionValidationSchema: ValidationSchema = {
  description: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  amount: {
    required: true,
    min: 0.01,
    max: 999999.99
  },
  category: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  date: {
    required: true,
    custom: (value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      if (date > new Date()) {
        return 'Data não pode ser futura';
      }
      return null;
    }
  },
  type: {
    required: true,
    custom: (value) => {
      if (!['income', 'expense'].includes(value)) {
        return 'Tipo deve ser receita ou despesa';
      }
      return null;
    }
  }
};

export const AccountValidationSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  type: {
    required: true,
    custom: (value) => {
      if (!['checking', 'savings', 'investment'].includes(value)) {
        return 'Tipo de conta inválido';
      }
      return null;
    }
  },
  bank: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  initialBalance: {
    required: true,
    min: 0
  }
};

export const CreditCardValidationSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  bank: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  limit: {
    required: true,
    min: 100,
    max: 999999.99
  },
  closingDay: {
    required: true,
    min: 1,
    max: 31
  },
  dueDay: {
    required: true,
    min: 1,
    max: 31
  },
  lastFourDigits: {
    required: true,
    pattern: /^\d{4}$/,
    custom: (value) => {
      if (value.length !== 4) {
        return 'Últimos 4 dígitos devem ter exatamente 4 números';
      }
      return null;
    }
  }
};

export const InvestmentValidationSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  type: {
    required: true,
    custom: (value) => {
      if (!['stocks', 'funds', 'crypto', 'pension', 'bonds', 'real_estate'].includes(value)) {
        return 'Tipo de investimento inválido';
      }
      return null;
    }
  },
  quantity: {
    required: true,
    min: 0.00001
  },
  averagePrice: {
    required: true,
    min: 0.01
  },
  currentPrice: {
    required: true,
    min: 0.01
  },
  broker: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  purchaseDate: {
    required: true,
    custom: (value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      if (date > new Date()) {
        return 'Data de compra não pode ser futura';
      }
      return null;
    }
  }
};

export const UserValidationSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    pattern: ValidationPatterns.email
  },
  password: {
    required: true,
    minLength: 6,
    pattern: ValidationPatterns.strongPassword,
    custom: (value) => {
      if (!ValidationPatterns.strongPassword.test(value)) {
        return 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo';
      }
      return null;
    }
  },
  partnerEmail: {
    required: false,
    pattern: ValidationPatterns.email
  }
};

// Utility functions for specific validations
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  
  return remainder === parseInt(cpf.charAt(10));
}

export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights1[i];
  }
  
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights2[i];
  }
  
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return digit2 === parseInt(cnpj.charAt(13));
}

export function validateCreditCardNumber(number: string): boolean {
  number = number.replace(/\s/g, '');
  
  if (!/^\d+$/.test(number)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Format utilities
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

export function formatDate(date: string | Date, format: string = 'DD/MM/YYYY'): string {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Data inválida';
  }
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
}

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  
  return cpf;
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }
  
  return cnpj;
}

