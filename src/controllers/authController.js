import User from "../models/User.js";
import jwt from "jsonwebtoken";
import generateOtp from "../config/generateOtp.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/sendMail.js";

const register = async (req, res) => {
  console.log("first");
  try {
    const { userName, email, password, confirmPassword } = req.body;

    if (!userName || !email || !password || !confirmPassword) {
      throw new Error("User Credientials Missing!");
    }
    if (password !== confirmPassword) {
      throw new Error("Password don't match!");
    }

    const userFound = await User.findOne({ email: email });

    if (userFound) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await User.create({
      userName,
      password: hashedPassword,
      email,
    });

    res.status(200).json({ message: "User registered successful", data });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      throw new Error("Invalid User");
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      userExist.password
    );

    if (!isPasswordMatched) {
      throw new Error("Invalid Credentials");
    }

    const payload = {
      email: userExist.email,
      id: userExist._id,
      role: userExist.role,
      userName: userExist.userName,
    };

    const token = jwt.sign(payload, "secretKey");

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 5 * 1000,
    });

    res.status(200).json({ message: "userLoggedIN successfully", token });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email is required!");
    }

    const doesUserExist = await User.findOne({ email });

    if (!doesUserExist) {
      throw new Error("User doesnot exist!");
    }

    const otp = generateOtp();

    const data = await Otp.create({
      email,
      otp,
    });

    sendMail(email, "Your OTP!", otp);

    res.cookie("email", email, {
      maxAge: 5 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.json({ message: "Otp sent sucessfully", otp });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new Error("Email and Otp are required for verification!");
    }

    const doesEmailMatch = await User.findOne({ email });

    if (!doesEmailMatch) {
      throw new Error("User isnot registered!");
    }

    const doesHaveOtp = await Otp.findOne({ email });

    if (!doesHaveOtp) {
      throw new Error("User doesn't have OTP!");
    }

    if (doesHaveOtp.otp !== otp) {
      throw new Error("OTP doesn't match!");
    }

    await User.findOneAndUpdate(
      { email },
      { otpExpiryDate: new Date(Date.now() + 5 * 60 * 1000) },
      { new: true }
    );

    //optional
    await Otp.findOneAndDelete({ email });

    res.status(200).json({ message: "OTP verified", data: doesHaveOtp });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and Password are required!");
    }

    const doesUserExist = await User.findOne({ email });

    if (!doesUserExist) {
      throw new Error("User is not registered!");
    }

    if (
      !doesUserExist.otpExpiryDate ||
      new Date() > doesUserExist.otpExpiryDate
    ) {
      throw new Error("Otp is not verified or is already expired!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        otpExpiryDate: null,
      },
      { new: true }
    );

    res.status(200).json({ message: "Password changed sucessfully!", data });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

export { register, login, forgotPassword, verifyOtp, resetPassword };
