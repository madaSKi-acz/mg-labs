/**
 * API Response Model
 * Represents a standardized API response structure (Data Transfer Object)
 * Implements encapsulation principle by wrapping HTTP responses
 */
export interface IApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
  timestamp?: Date;
}

/**
 * Concrete Implementation of API Response
 */
export class ApiResponse<T> implements IApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
  timestamp: Date;

  constructor(data: T, message: string, success: boolean, statusCode: number) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.statusCode = statusCode;
    this.timestamp = new Date();
  }

  /**
   * Factory method to create success response
   */
  static success<T>(data: T, message: string = 'Success', statusCode: number = 200): ApiResponse<T> {
    return new ApiResponse(data, message, true, statusCode);
  }

  /**
   * Factory method to create error response
   */
  static error<T>(message: string, statusCode: number = 500): ApiResponse<T> {
    return new ApiResponse(null as T, message, false, statusCode);
  }
}

/**
 * Paginated Response Model
 * Extends base response with pagination metadata
 */
export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class PaginatedResponse<T> extends ApiResponse<T[]> implements IPaginatedResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(
    data: T[],
    message: string,
    page: number,
    limit: number,
    total: number,
    statusCode: number = 200
  ) {
    super(data, message, true, statusCode);
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Check if there are more pages
   */
  hasNextPage(): boolean {
    return this.pagination.page < this.pagination.totalPages;
  }

  /**
   * Check if there are previous pages
   */
  hasPreviousPage(): boolean {
    return this.pagination.page > 1;
  }
}

/**
 * Custom Error class for API errors
 * Implements proper error handling with OOP principles
 */
export class ApiError extends Error {
  statusCode: number;
  errors: string[];

  constructor(message: string, statusCode: number = 500, errors: string[] = []) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }

  /**
   * Check if error is client error (4xx)
   */
  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /**
   * Check if error is server error (5xx)
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }
}