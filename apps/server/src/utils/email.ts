import nodemailer from "nodemailer";

// Simple Transport Setup (Console log mode in Dev, SMTP in Prod)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  // Terminal log for quick testing if SMTP isn't configured yet
  console.log(`\n========== 📩 OTP FOR ${email}: ${otp} ==========\n`);

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    await transporter.sendMail({
      from: `"Beyownd Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Verification Code - Beyownd",
      html: `<h3>Your OTP Code is: <b>${otp}</b></h3><p>This code will expire in 10 minutes.</p>`,
    });
  }
};