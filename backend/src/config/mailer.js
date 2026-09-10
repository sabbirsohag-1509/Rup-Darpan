import nodemailer from "nodemailer";
import env from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
      console.warn("⚠️ EMAIL_USER or EMAIL_PASS not configured. Skipping email dispatch.");
      return { success: false, message: "Email service not configured" };
    }

    const info = await transporter.sendMail({
      from: `"Rup Darpon Team" <${env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email dispatch failed:", error.message);
    throw error;
  }
};

export default transporter;
