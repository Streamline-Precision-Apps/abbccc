import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  if (process.env.NODE_ENV === "production") {
    const resetLink = `https://shiftscanapp.com/signin/new-password?token=${token}`; // add a way to confirm email via a url

    await resend.emails.send({
      from: "no-reply@shiftscanapp.com",
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
    });
  } else {
    const resetLink = `http://localhost:3000/signin/new-password?token=${token}`; // add a way to confirm email via a url

    await resend.emails.send({
      from: "no-reply@shiftscanapp.com",
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
    });
  }
};
