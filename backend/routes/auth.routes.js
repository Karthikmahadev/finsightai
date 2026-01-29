import express from "express";
import multer from "multer";
import path from "path";
import {
  loginUser,
  registerUser,
  verifyOtp,
  changePassword,
  updateProfileInfo,
  getProfile,
  forgotPassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ---------- MULTER SETUP ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ---------- PUBLIC ---------- */
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.put("/forgot-password", forgotPassword);

/* ---------- PROTECTED ---------- */
router.get("/me", protect, getProfile);
router.put(
  "/update-profile",
  protect,
  upload.single("profileImage"),
  updateProfileInfo
);
router.put("/change-password", protect, changePassword);

export default router;
