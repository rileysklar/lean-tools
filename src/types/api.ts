/**
 * Standard API response interface for all endpoints
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

/**
 * Paginated API response interface
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Error response interface
 */
export interface ApiErrorResponse extends ApiResponse<never> {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Success response interface
 */
export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * API request interface
 */
export interface ApiRequest<T = any> {
  data?: T;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

/**
 * API endpoint configuration
 */
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  requiresAuth: boolean;
  requiredPermissions?: string[];
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

/**
 * Utility types for API responses
 */
export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type guard to check if response is successful
 */
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isApiError<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Extract data from successful API response
 */
export function extractApiData<T>(response: ApiResponse<T>): T | undefined {
  return isApiSuccess(response) ? response.data : undefined;
}

/**
 * Extract error from API response
 */
export function extractApiError<T>(
  response: ApiResponse<T>
): string | undefined {
  return isApiError(response) ? response.error : undefined;
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create an error response
 */
export function createErrorResponse(
  error: string,
  code?: string,
  details?: Record<string, any>
): ApiErrorResponse {
  return {
    success: false,
    error,
    code,
    details,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}
