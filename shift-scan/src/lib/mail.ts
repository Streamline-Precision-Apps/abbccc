import { Resend } from "resend";
import { reportError } from "./sentryErrorHandler";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

/**
 * Sends a password reset email to the specified address with the provided token.
 * Reports errors to Sentry and rethrows for upstream handling.
 * @param email - The recipient's email address
 * @param token - The password reset token
 */
export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const resetLink = isProd
      ? `https://shiftscanapp.com/signin/new-password?token=${token}`
      : `http://localhost:3000/signin/new-password?token=${token}`;

    await resend.emails.send({
      from: "no-reply@shiftscanapp.com",
      to: email,
      subject: "Reset your password",
      html: `
      <p>Hello,</p>
      <p>You have requested to reset your password. Please click the link below to set a new password:</p>
      <p>Click <a href="${resetLink}">here</a> to reset password</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you,</p>
      <p>ShiftScan Team</p>
      `,
    });
  } catch (error) {
    reportError(error, { location: "mail/sendPasswordResetEmail", email });
    throw error;
  }
};
