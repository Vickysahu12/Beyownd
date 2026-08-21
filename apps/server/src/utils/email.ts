import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    const data = await resend.emails.send({
      from: "Beyownd <onboarding@resend.dev>", // Testing mode domain
      to: [to],
      subject: "Your Beyownd Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Welcome to Beyownd! 🚀</h2>
          <p style="font-size: 16px; color: #374151;">Use the OTP below to verify your email address:</p>
          <div style="background-color: #e0e7ff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4338ca; letter-spacing: 6px; margin: 0; font-size: 32px;">${otp}</h1>
          </div>
          <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });
    return data;
  } catch (error) {
    console.error("❌ Resend Email Failed:", error);
    return null;
  }
};