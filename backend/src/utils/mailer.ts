import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter: nodemailer.Transporter | null = null;

export async function getTransporter() {
  if (transporter) return transporter;

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
    return transporter;
  }

  // Fallback to ethereal for development if no SMTP config
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const t = await getTransporter();
  const info = await t.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: 'Reset your FlowAI Nepal password',
    text: `You requested a password reset. Use the link: ${resetUrl}`,
    html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p><p>If you didn't request this, ignore this email.</p>`,
  });

  if (!env.SMTP_HOST) {
    console.info('Password reset email sent preview URL:', nodemailer.getTestMessageUrl(info));
  }
  return info;
}


export async function sendPaymentInitiatedEmail(input: {
  to: string;
  name: string;
  planName: string;
  amountNpr: number;
  providerLabel: string;
  referenceCode: string;
  qrPayload: string;
  billingUrl: string;
}) {
  const t = await getTransporter();
  const info = await t.sendMail({
    from: env.SMTP_FROM,
    to: input.to,
    subject: `Payment request received for ${input.planName}`,
    text: [
      `Hi ${input.name},`,
      '',
      `We received your payment request for ${input.planName}.`,
      `Amount: NPR ${input.amountNpr.toLocaleString()}`,
      `Provider: ${input.providerLabel}`,
      `Reference: ${input.referenceCode}`,
      '',
      `Open billing: ${input.billingUrl}`,
      `QR payload: ${input.qrPayload}`,
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px">Payment request received</h2>
        <p>Hi ${input.name},</p>
        <p>Your order for <strong>${input.planName}</strong> has been created.</p>
        <ul>
          <li><strong>Amount:</strong> NPR ${input.amountNpr.toLocaleString()}</li>
          <li><strong>Provider:</strong> ${input.providerLabel}</li>
          <li><strong>Reference:</strong> ${input.referenceCode}</li>
        </ul>
        <p>Open your billing panel: <a href="${input.billingUrl}">${input.billingUrl}</a></p>
        <p>If you need to scan the QR from another device, use this QR payload:</p>
        <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;padding:12px;border-radius:12px">${input.qrPayload}</pre>
      </div>
    `,
  });

  if (!env.SMTP_HOST) {
    console.info('Payment request email sent preview URL:', nodemailer.getTestMessageUrl(info));
  }
  return info;
}

export async function sendPaymentActivatedEmail(input: {
  to: string;
  name: string;
  planName: string;
  expiresAt: Date;
  billingUrl: string;
}) {
  const t = await getTransporter();
  const info = await t.sendMail({
    from: env.SMTP_FROM,
    to: input.to,
    subject: `Your ${input.planName} subscription is now active`,
    text: [
      `Hi ${input.name},`,
      '',
      `Your ${input.planName} subscription has been activated.`,
      `Expires: ${input.expiresAt.toDateString()}`,
      '',
      `Billing panel: ${input.billingUrl}`,
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 12px">Subscription activated</h2>
        <p>Hi ${input.name},</p>
        <p>Your <strong>${input.planName}</strong> subscription is now active.</p>
        <p><strong>Expires:</strong> ${input.expiresAt.toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p>Open your billing panel: <a href="${input.billingUrl}">${input.billingUrl}</a></p>
      </div>
    `,
  });

  if (!env.SMTP_HOST) {
    console.info('Payment activation email sent preview URL:', nodemailer.getTestMessageUrl(info));
  }
  return info;
}
