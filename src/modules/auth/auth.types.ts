export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  // auth.model.ts
refreshToken:string;
isVerified: Boolean;
verificationToken?: string | null;

}