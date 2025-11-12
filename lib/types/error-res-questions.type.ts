// Tipos de error específicos
type ErrorType =
  | "ai_overloaded"
  | "rate_limit"
  | "pdf_error"
  | "server_error"
  | "network_error"
  | "unknown";

// Respuesta de error
export interface ErrorResponse {
  error: ErrorType;
  message: string;
  details?: string;
}

// Respuesta exitosa
export interface SuccessResponse<T = unknown> {
  result: T;
}

// Union discriminada - TypeScript sabrá qué tipo es basándose en la presencia de 'error'
export type ApiResponse<T = unknown> = ErrorResponse | SuccessResponse<T>;

// Type guard para verificar si es un error
export function isErrorResponse(data: ApiResponse): data is ErrorResponse {
  return "error" in data;
}
