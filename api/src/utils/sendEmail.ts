import nodemailer from "nodemailer";
import { env } from "@/config";

export default async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"EduCRM" <${env.SMTP_FROM}>`,
    to,
    subject,
    html,
  });

  console.log("Email preview URL (dev):", nodemailer.getTestMessageUrl(info));
  return info;
}
