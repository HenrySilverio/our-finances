// Error handling utilities and middleware for API routes

export enum ErrorCode {
  // Validation errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Authentication errors (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Authorization errors (403)
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Not found errors (404)
  NOT_FOUND = 'NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  CREDIT_CARD_NOT_FOUND = 'CREDIT_CARD_NOT_FOUND',
  INVESTMENT_NOT_FOUND = 'INVESTMENT_NOT_FOUND',
  
  // Conflict errors (409)
  CONFLICT = 'CONFLICT',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  ACCOUNT_ALREADY_EXISTS = 'ACCOUNT_ALREADY_EXISTS',
  
  // Business logic errors (422)
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_TRANSACTION_DATE = 'INVALID_TRANSACTION_DATE',
  CREDIT_LIMIT_EXCEEDED = 'CREDIT_LIMIT_EXCEEDED',
  
  // Server errors (500)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: any;
  field?: string;
  statusCode: number;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly field?: string;

  constructor(code: ErrorCode, message: string, statusCode: number = 500, details?: any, field?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.field = field;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError);
  }

  toJSON(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      field: this.field,
      statusCode: this.statusCode
    };
  }
}

// Predefined error creators
export const ValidationError = (message: string, field?: string, details?: any) =>
  new AppError(ErrorCode.VALIDATION_ERROR, message, 400, details, field);

export const UnauthorizedError = (message: string = 'Não autorizado') =>
  new AppError(ErrorCode.UNAUTHORIZED, message, 401);

export const ForbiddenError = (message: string = 'Acesso negado') =>
  new AppError(ErrorCode.FORBIDDEN, message, 403);

export const NotFoundError = (message: string = 'Recurso não encontrado') =>
  new AppError(ErrorCode.NOT_FOUND, message, 404);

export const ConflictError = (message: string, details?: any) =>
  new AppError(ErrorCode.CONFLICT, message, 409, details);

export const BusinessRuleError = (message: string, details?: any) =>
  new AppError(ErrorCode.BUSINESS_RULE_VIOLATION, message, 422, details);

export const InternalServerError = (message: string = 'Erro interno do servidor', details?: any) =>
  new AppError(ErrorCode.INTERNAL_SERVER_ERROR, message, 500, details);

// Error messages in Portuguese
export const ErrorMessages = {
  [ErrorCode.VALIDATION_ERROR]: 'Dados inválidos',
  [ErrorCode.INVALID_INPUT]: 'Entrada inválida',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'Campo obrigatório não informado',
  
  [ErrorCode.UNAUTHORIZED]: 'Não autorizado',
  [ErrorCode.INVALID_TOKEN]: 'Token inválido',
  [ErrorCode.TOKEN_EXPIRED]: 'Token expirado',
  
  [ErrorCode.FORBIDDEN]: 'Acesso negado',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permissões insuficientes',
  
  [ErrorCode.NOT_FOUND]: 'Recurso não encontrado',
  [ErrorCode.USER_NOT_FOUND]: 'Usuário não encontrado',
  [ErrorCode.TRANSACTION_NOT_FOUND]: 'Transação não encontrada',
  [ErrorCode.ACCOUNT_NOT_FOUND]: 'Conta não encontrada',
  [ErrorCode.CREDIT_CARD_NOT_FOUND]: 'Cartão de crédito não encontrado',
  [ErrorCode.INVESTMENT_NOT_FOUND]: 'Investimento não encontrado',
  
  [ErrorCode.CONFLICT]: 'Conflito de dados',
  [ErrorCode.EMAIL_ALREADY_EXISTS]: 'Email já está em uso',
  [ErrorCode.ACCOUNT_ALREADY_EXISTS]: 'Conta já existe',
  
  [ErrorCode.BUSINESS_RULE_VIOLATION]: 'Violação de regra de negócio',
  [ErrorCode.INSUFFICIENT_BALANCE]: 'Saldo insuficiente',
  [ErrorCode.INVALID_TRANSACTION_DATE]: 'Data da transação inválida',
  [ErrorCode.CREDIT_LIMIT_EXCEEDED]: 'Limite do cartão excedido',
  
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Erro interno do servidor',
  [ErrorCode.DATABASE_ERROR]: 'Erro no banco de dados',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'Erro em serviço externo'
};

// Error handler middleware for API routes
export function handleApiError(error: any): Response {
  console.error('API Error:', error);

  // Handle AppError instances
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.toJSON()
      }),
      {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Handle MongoDB/Mongoose errors
  if (error.name === 'ValidationError') {
    const validationErrors: Record<string, string> = {};
    
    for (const field in error.errors) {
      validationErrors[field] = error.errors[field].message;
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Dados inválidos',
          details: validationErrors,
          statusCode: 400
        }
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (error.name === 'CastError') {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: ErrorCode.INVALID_INPUT,
          message: 'ID inválido',
          statusCode: 400
        }
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (error.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: ErrorCode.CONFLICT,
          message: `${field} já está em uso`,
          field,
          statusCode: 409
        }
      }),
      {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Handle generic errors
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Erro interno do servidor',
        statusCode: 500
      }
    }),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Success response helper
export function successResponse(data: any, message?: string, statusCode: number = 200): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      message
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

// Async error wrapper for API routes
export function asyncHandler(fn: Function) {
  return async (request: Request, context?: any) => {
    try {
      return await fn(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Validation middleware
export function validateRequest(schema: any) {
  return async (request: Request) => {
    try {
      const body = await request.json();
      
      // Here you would use your validation schema
      // For now, we'll just return the body
      return body;
    } catch (error) {
      throw ValidationError('JSON inválido no corpo da requisição');
    }
  };
}

// Authentication middleware
export function requireAuth() {
  return async (request: Request) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw UnauthorizedError('Token de acesso requerido');
    }

    const token = authHeader.substring(7);
    
    // Here you would validate the JWT token
    // For now, we'll just check if it exists
    if (!token) {
      throw UnauthorizedError('Token inválido');
    }

    // Return user info or token payload
    return { userId: 'user123', email: 'user@example.com' };
  };
}

// Rate limiting (simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return async (request: Request) => {
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < windowStart) {
        rateLimitStore.delete(key);
      }
    }

    const current = rateLimitStore.get(clientIp) || { count: 0, resetTime: now + windowMs };

    if (current.count >= maxRequests && current.resetTime > now) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        'Muitas requisições. Tente novamente mais tarde.',
        429
      );
    }

    current.count++;
    rateLimitStore.set(clientIp, current);
  };
}

// CORS middleware
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Request logging
export function logRequest(request: Request) {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
}

// Database connection error handler
export function handleDatabaseError(error: any): never {
  console.error('Database Error:', error);
  
  if (error.name === 'MongoNetworkError') {
    throw InternalServerError('Erro de conexão com o banco de dados');
  }
  
  if (error.name === 'MongoTimeoutError') {
    throw InternalServerError('Timeout na conexão com o banco de dados');
  }
  
  throw InternalServerError('Erro no banco de dados', error.message);
}

// Input sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove potential XSS attacks
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// File upload validation
export function validateFileUpload(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
} = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  } = options;

  if (file.size > maxSize) {
    throw ValidationError(`Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    throw ValidationError(`Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`);
  }

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw ValidationError(`Extensão não permitida. Extensões aceitas: ${allowedExtensions.join(', ')}`);
  }
}

