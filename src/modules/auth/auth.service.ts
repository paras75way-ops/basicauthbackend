// auth.service.ts
import bcrypt from "bcryptjs";
import User from "./auth.models";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { IUser } from "./auth.types";
import crypto from "crypto";
import { sendVerificationEmail } from "../../utils/email";
export const registerUser = async (data: IUser) => {
  const { name, email, password, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

   
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    verificationToken,
    isVerified: false,
  });

  // 🔥 Send verification email
  await sendVerificationEmail(email, verificationToken);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
  };
};
 


export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};