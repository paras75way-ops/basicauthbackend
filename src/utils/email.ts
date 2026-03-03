import { Resend } from "resend";



export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify your account:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  });
};