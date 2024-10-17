import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`; // add a way to confirm email via a url

  await resend.emails.send({
    from: "no-reply@StreamlinePrecision.com",
    to: email,
    subject: "confirm your email",
    html: `<a href="${confirmLink}">Confirm your email</a>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`; // add a way to confirm email via a url

  await resend.emails.send({
    from: "no-reply@StreamlinePrecision.com",
    to: email,
    subject: "Reset your password",
    html: `<a href="${resetLink}">To reset your password</a>`,
  });
};
