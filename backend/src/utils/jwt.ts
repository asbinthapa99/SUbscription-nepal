import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { env } from "../config/env.js";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: Role;
};

const signOptions: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
};

export const signAuthToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, signOptions);

export const verifyAuthToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
