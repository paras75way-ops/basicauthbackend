// auth.routes.ts
import express from "express";
import { register, login, refreshToken,logout,getMe, verifyEmail } from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/verify-email", verifyEmail);
export default router;