 
import { Request, Response } from "express";
import * as authService from "./auth.service";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/token";
import User from "./auth.models";
import { AuthRequest } from "../../middleware/auth.middleware";
 

interface RefreshTokenPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } =
      await authService.registerUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(201).json({ accessToken });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Registration failed";
    return res.status(400).json({ message });
  }
};

 

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } =
      await authService.loginUser(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({ accessToken });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return res.status(400).json({ message });
  }
};
 
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as RefreshTokenPayload;

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

 

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET!
      ) as RefreshTokenPayload;

      await User.findByIdAndUpdate(decoded.id, {
        refreshToken: null,
      });
    } catch {
       
    }
  }

  res.clearCookie("refreshToken");

  return res.json({ message: "Logged out" });
};

 

export const getMe = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
};
 

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verificationToken = null; 
  await user.save();

  return res.json({ message: "Email verified successfully" });
};