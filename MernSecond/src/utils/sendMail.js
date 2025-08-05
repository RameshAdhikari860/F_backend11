import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (email, subject = "Your OTP!", message) => {
  const info = await transporter.sendMail({
    from: `"Prabesh Dahal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `<b>${message}</b>`,
  });
  console.log("Mail sent to: ", info.messageId);
};

export { sendMail };
