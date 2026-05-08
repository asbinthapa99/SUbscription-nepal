import { prisma } from "../../db/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { signAuthToken } from "../../utils/jwt.js";
import crypto from "crypto";
import { addMinutes, addHours } from "date-fns";

const RESET_TOKEN_TTL_MINUTES = 30;
const VERIFY_TOKEN_TTL_HOURS = 24;

export const registerUser = async (input: { name: string; email: string; password: string }) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password)
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  const token = signAuthToken({ sub: user.id, email: user.email, role: user.role });

  return { user, token };
};

export const loginUser = async (input: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !(await comparePassword(input.password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signAuthToken({ sub: user.id, email: user.email, role: user.role });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    token
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerifiedAt: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const createEmailVerificationToken = async (userId: string): Promise<string> => {
  await prisma.emailVerificationToken.deleteMany({ where: { userId } });
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: { userId, token, expiresAt: addHours(new Date(), VERIFY_TOKEN_TTL_HOURS) }
  });
  return token;
};

export const verifyEmail = async (token: string) => {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    throw new ApiError(400, "Invalid or expired verification link");
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } }),
    prisma.emailVerificationToken.delete({ where: { id: record.id } }),
  ]);
};

export const createPasswordReset = async (email: string): Promise<{ token: string } | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = addMinutes(new Date(), RESET_TOKEN_TTL_MINUTES);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt }
  });

  return { token };
};

export const consumePasswordReset = async (token: string, newPassword: string) => {
  const pr = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!pr || pr.used || pr.expiresAt < new Date()) {
    throw new ApiError(400, "Invalid or expired token");
  }

  const hashed = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: pr.userId }, data: { passwordHash: hashed } }),
    prisma.passwordResetToken.update({ where: { id: pr.id }, data: { used: true } }),
  ]);
};

