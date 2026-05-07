import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";
import { env } from "../config/env.js";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten()
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  return res.status(500).json({
    message: "Internal server error",
    ...(env.NODE_ENV !== "production" ? { error: error instanceof Error ? error.message : error } : {})
  });
};

