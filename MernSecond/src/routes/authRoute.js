import express from "express";
import {
  login,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/verifyToken.js";
import Otp from "../models/Otp.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//Forgot Password
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);


//verification
router.get("/verify/:step", async (req, res) => {
  const { step } = req.params;

  const token = req.cookies.authToken;
  const email = req.cookies.email;
  console.log(email);

  try {
    if (step === "home") {
      if (!token) {
        throw new Error("No token found!");
      }

      const isValid = verifyToken(token);

      if (!isValid) {
        throw new Error("Token is wrong or exipred!");
      }
    }

    if (step === "otp") {
      if (!email) {
        throw new Error("Email not found!");
      }

      const isOtpSent = await Otp.findOne({ email });

      if (!isOtpSent) {
        throw new Error("OTP exipred or not set!");
      }
    }

    if (step === "reset") {
      if (!email) {
        throw new Error("Email not found!");
      }

      const userOtp = await User.findOne({ email });

      if (new Date() > userOtp.otpExpiryDate) {
        throw new Error("OTP expired!");
      }
    }

    return res.status(200).json({ message: "Verification successful!" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: error.message,
    });
  }
});

export default router;
