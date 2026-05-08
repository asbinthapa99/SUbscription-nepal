import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { ApiError } from "../utils/api-error.js";
import { verifyAuthToken } from "../utils/jwt.js";

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  let token: string | undefined;

  if (header?.startsWith("Bearer ")) {
    token = header.slice("Bearer ".length);
  } else if (req.headers.cookie) {
    // parse simple cookie header for `token`
    const match = req.headers.cookie.split(";").map(s => s.trim()).find(s => s.startsWith("token="));
    if (match) token = decodeURIComponent(match.split("=")[1] || "");
  }

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role
  };

  next();
};

export const requireOptionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  let token: string | undefined;

  if (header?.startsWith("Bearer ")) {
    token = header.slice("Bearer ".length);
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.split(";").map(s => s.trim()).find(s => s.startsWith("token="));
    if (match) token = decodeURIComponent(match.split("=")[1] || "");
  }

  if (!token) {
    next();
    return;
  }

  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    next();
    return;
  }

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role
  };

  next();
};

export const requireRole =
  (role: Role) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    if (req.user.role !== role) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };
