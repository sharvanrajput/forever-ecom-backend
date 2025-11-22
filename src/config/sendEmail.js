// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,  
        pass: process.env.MAIL_PASS,  
      },
    });

    await transporter.sendMail({
      from: `"Your Shop Name" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
