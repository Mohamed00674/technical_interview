import { AppErrorDefinition, AppErrorType } from "../types/app-error";
import _logger from "./logger";

/**
 * Error Map — similar to NestJS exceptions
 */
export type ErrorMapType = Record<AppErrorType, AppErrorDefinition>;

export const ERROR_MAP: ErrorMapType = {
  BAD_REQUEST: {
    type: "BAD_REQUEST",
    message: "Bad request. Please verify your input.",
    statusCode: 400,
  },
  UNAUTHORIZED: {
    type: "UNAUTHORIZED",
    message: "You are not authorized to access this resource.",
    statusCode: 401,
  },
  FORBIDDEN: {
    type: "FORBIDDEN",
    message: "Access to this resource is forbidden.",
    statusCode: 403,
  },
  NOT_FOUND: {
    type: "NOT_FOUND",
    message: "The requested resource was not found.",
    statusCode: 404,
  },
  CONFLICT: {
    type: "CONFLICT",
    message: "Conflict detected. The resource already exists.",
    statusCode: 409,
  },
  NOT_ACCEPTABLE: {
    type: "NOT_ACCEPTABLE",
    message: "The requested format or parameters are not acceptable.",
    statusCode: 406,
  },
  VALIDATION_ERROR: {
    type: "VALIDATION_ERROR",
    message: "Invalid data provided. Please correct the input.",
    statusCode: 422,
  },
  DATABASE_ERROR: {
    type: "DATABASE_ERROR",
    message: "Database operation failed.",
    statusCode: 500,
  },
  INTERNAL_SERVER_ERROR: {
    type: "INTERNAL_SERVER_ERROR",
    message: "An internal server error occurred.",
    statusCode: 500,
  },
  SERVICE_UNAVAILABLE: {
    type: "SERVICE_UNAVAILABLE",
    message: "The service is temporarily unavailable.",
    statusCode: 503,
  },
  TOKEN_EXPIRED: {
    type: "TOKEN_EXPIRED",
    statusCode: 401,
    message: "Token expired",
  },
  REFRESH_TOKEN_EXPIRED: {
    type: "REFRESH_TOKEN_EXPIRED",
    statusCode: 401,
    message: "Refresh token expired",
  },
  INVALID_TOKEN: {
    type: "INVALID_TOKEN",
    statusCode: 401,
    message: "Invalid token",
  },
  INVALID_REFRESH_TOKEN: {
    type: "INVALID_REFRESH_TOKEN",
    statusCode: 401,
    message: "Invalid refresh token",
  },
  UNKNOWN_ERROR: {
    type: "UNKNOWN_ERROR",
    message: "An unknown error occurred.",
    statusCode: 500,
  },
};

export function isKnownError(error: unknown): error is AppErrorDefinition {
  return (
    error !== null &&
    typeof error === "object" &&
    "type" in error &&
    Object.keys(ERROR_MAP).includes(String(error.type)) &&
    "message" in error &&
    "statusCode" in error
  );
}

export function handleError(error: unknown): AppErrorDefinition {
  if (error && typeof error === "object" && "message" in error) {
    const message =
      typeof error === "string" ? error : ((error as any).message as string);

    // Try to match by type name in message (case-insensitive)
    const matchedError = Object.values(ERROR_MAP).find((e) =>
      message.toLowerCase().includes(e.type.toLowerCase().replace("_", " "))
    );

    if (matchedError) return matchedError;

    // If message is defined but doesn’t match any known error type
    return {
      type: "UNKNOWN_ERROR",
      message: message || "An unknown error occurred.",
      statusCode: 500,
    };
  }

  return ERROR_MAP.UNKNOWN_ERROR;
}

export function handleCatch(
  error: unknown,
  logUnknown = true
): AppErrorDefinition {
  if (isKnownError(error)) {
    return error;
  }

  if (logUnknown) {
    _logger.error(`${ERROR_MAP.INTERNAL_SERVER_ERROR.type}: ${String(error)}`);
    _logger.log();
    _logger.log();
    _logger.log();
  }

  return ERROR_MAP.INTERNAL_SERVER_ERROR;
}
