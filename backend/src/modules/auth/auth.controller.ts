import { asyncHandler } from "../../utils/async-handler.js";
import { getCurrentUser, loginUser, registerUser, createPasswordReset, consumePasswordReset, createEmailVerificationToken, verifyEmail } from "./auth.service.js";
import { loginSchema, registerSchema, forgotSchema, resetSchema } from "./auth.validation.js";
import { sendPasswordResetEmail, sendEmailVerificationEmail } from "../../utils/mailer.js";
import { env } from "../../config/env.js";

export const register = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const result = await registerUser(input);

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const verifyToken = await createEmailVerificationToken(result.user.id);
  const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(verifyToken)}`;
  sendEmailVerificationEmail(result.user.email, verifyUrl).catch(() => {});

  res.status(201).json(result);
});

export const resendVerification = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user!.id);
  if (user.emailVerifiedAt) {
    res.json({ message: "Email already verified" });
    return;
  }
  const verifyToken = await createEmailVerificationToken(user.id);
  const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(verifyToken)}`;
  sendEmailVerificationEmail(user.email, verifyUrl).catch(() => {});
  res.json({ message: "Verification email sent" });
});

export const verifyEmailHandler = asyncHandler(async (req, res) => {
  const token = String(req.query.token || "");
  await verifyEmail(token);
  res.json({ message: "Email verified successfully" });
});

export const login = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const result = await loginUser(input);

  const token = result.token;
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json(result);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user!.id);

  res.json({ user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const input = forgotSchema.parse(req.body);
  const result = await createPasswordReset(input.email);

  if (result) {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(result.token)}`;
    await sendPasswordResetEmail(input.email, resetUrl);
  }

  res.json({ message: "If the email exists, a reset link has been sent." });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const input = resetSchema.parse(req.body);
  await consumePasswordReset(input.token, input.password);
  res.json({ message: "Password has been reset" });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

