import nodemailer from "nodemailer";
import { config } from "../config.js";

console.log("📧 Email Configuration:");
console.log("   EMAIL_USER:", config.emailUser ? "✅ Set" : "❌ Missing");
console.log("   EMAIL_PASSWORD:", config.emailPassword ? "✅ Set" : "❌ Missing");
console.log("   EMAIL_HOST:", config.emailHost);
console.log("   EMAIL_PORT:", config.emailPort);

let transporter;

if (!config.emailUser || !config.emailPassword) {
  console.warn('⚠️  Email credentials missing!');
  console.warn('   For Gmail:');
  console.warn('   1. Enable 2-Step Authentication');
  console.warn('   2. Generate an App Password (16-character password)');
  console.warn('   3. Set EMAIL_USER=your-email@gmail.com');
  console.warn('   4. Set EMAIL_PASSWORD=your-app-password');
  console.warn('   For other services, use your email and SMTP password');
} else {
  transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: Number(config.emailPort) || 587,
    secure: Number(config.emailPort) === 465,
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  });
}

export const sendOTPEmail = async (email, otp) => {
  if (!config.emailUser || !config.emailPassword || !transporter) {
    console.warn('⚠️  Email service not configured. OTP (for testing):', otp);
    return false;
  }

  try {
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "🔐 Your OTP for E-Voting System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your One-Time Password (OTP) for the Digital Voting System is:</p>
          <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </h1>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent successfully:", info.response);
    return true;

  } catch (error) {
    console.error("❌ Email Error:", error.message);
    if (error.message.includes('Invalid login') || error.message.includes('Invalid credentials')) {
      console.error('   Check: EMAIL_USER and EMAIL_PASSWORD are correct');
    }
    return false;
  }
};

export const sendPasswordResetEmail = async (email, link) => {
  if (!config.emailUser || !config.emailPassword || !transporter) {
    console.warn('⚠️  Email service not configured.');
    return false;
  }

  try {
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "🔑 Password Reset - E-Voting System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Reset Password
          </a>
          <p style="color: #666;">This link will expire in 1 hour.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Password Reset Email sent successfully");
    return true;

  } catch (error) {
    console.error("❌ Reset Email Error:", error.message);
    return false;
  }
};
