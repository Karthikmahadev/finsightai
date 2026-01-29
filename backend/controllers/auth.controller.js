import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

import fs from "fs";
import path from "path";

/* SIGN UP (NO TOKEN) */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000,
        isVerified: false,
      },
      { upsert: true, new: true }
    );

    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Optionally respond with an error, or just log and continue
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(201).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* VERIFY OTP → REGISTER + LOGIN */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpiry < Date.now())
    return res.status(400).json({ message: "Invalid or expired OTP" });

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({
    message: "Email verified",
    token: generateToken(user), // Pass the full user object to generateToken
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

/* LOGIN (ONLY VERIFIED USERS) */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // ❌ User not found
  if (!user) {
    return res.status(404).json({
      message: "Account not found. Please sign up first.",
    });
  }

  // ❌ Email not verified
  if (!user.isVerified) {
    return res.status(403).json({
      message: "Please verify your email before logging in.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  // ❌ Wrong password
  if (!isMatch) {
    return res.status(401).json({
      message: "Incorrect email or password.",
    });
  }

  // ✅ Success
  res.json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

/* ---------- FORGOT PASSWORD ---------- */
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* UPDATE USER PROFILE */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user), // Pass the full user object to generateToken
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* ---------------- CHANGE PASSWORD ---------------- */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




/* ---------- GET PROFILE ---------- */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name profileImage email"
    );

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

/* ---------- UPDATE PROFILE ---------- */
export const updateProfileInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const updates = [];

    // For FormData, name comes from req.body.name
    if (req.body.name) {
      user.name = req.body.name;
      updates.push("Name updated");
    }

    // For file upload
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
      updates.push("Image uploaded successfully");
    }

    if (updates.length === 0) {
      return res.json({
        success: true,
        message: "Nothing to update",
      });
    }

    await user.save();

    res.json({
      success: true,
      message: updates.join(" & "),
      user: {
        name: user.name,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

