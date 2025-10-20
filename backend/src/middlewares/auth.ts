import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import { EnvConfig } from "../config/env";
import { ERROR_MAP, isKnownError } from "./errorHandler";
import { UserRole } from "../modules/user/user.model";
import { ExpressRequestWithAuth } from "../types/request-user";
import { AppErrorDefinition } from "../types/app-error";

interface JwtPayloadExtended {
  id: string;
  roles: UserRole[];
}

// endpoint authentication middleware
export const authenticate = (
  req: ExpressRequestWithAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw ERROR_MAP.UNAUTHORIZED;

    const token = authHeader?.split(" ")?.[1];
    if (!token) throw ERROR_MAP.UNAUTHORIZED;

    const payload = jwt.verify(
      token,
      EnvConfig.jwtSecret
    ) as JwtPayloadExtended;

    req.user = payload;

    next();
  } catch (err) {
    let appError = err as AppErrorDefinition;

    if (err instanceof TokenExpiredError) {
      appError = ERROR_MAP.TOKEN_EXPIRED;
    } else if (isKnownError(err)) {
      appError = err as AppErrorDefinition;
    } else {
      appError = ERROR_MAP.INVALID_TOKEN;
    }

    res.status(appError.statusCode).json({
      success: false,
      error: appError.type,
      message: appError.message,
    });
  }
};

// role-based middleware
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: ExpressRequestWithAuth, res: Response, next: NextFunction) => {
    const userRoles = req?.user?.roles || [];

    if (!req.user || !userRoles.find((role) => allowedRoles.includes(role))) {
      const appError = ERROR_MAP.UNAUTHORIZED;

      return res.status(appError.statusCode).json({
        success: false,
        error: appError.type,
        message: appError.message,
      });
    }

    next();
  };
};
