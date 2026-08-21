import nodemailer from "nodemailer";

// Port 465 + secure: true Render/Cloud environments ke liye required hai
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // Port 465 ke saath true (Render par port 587 block hota hai)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // 16-character App Password
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"Beyownd Team" <${process.env.SMTP_USER}>`,
    to,
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
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Email bhejney mein issue hua:", error);
    throw new Error("Failed to send OTP email. Please try again.");
  }
};