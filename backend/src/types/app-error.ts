export type AppErrorType =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "NOT_ACCEPTABLE"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "TOKEN_EXPIRED"
  | "REFRESH_TOKEN_EXPIRED"
  | "INVALID_TOKEN"
  | "INVALID_REFRESH_TOKEN"
  | "INTERNAL_SERVER_ERROR"
  | "UNKNOWN_ERROR";

export interface AppErrorDefinition {
  type: AppErrorType;
  message: string;
  statusCode: number;
  cause?: string;
}
