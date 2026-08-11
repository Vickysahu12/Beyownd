import jwt from "jsonwebtoken";

// Exact same secret fallback for both sign and verify
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "beyownd_super_secret_access_key_123";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "beyownd_super_secret_refresh_key_123";

export const generateAccessToken = (payload: { userId: string; email: string }) => {
  // Dev mode me expiry 1d kar dete hain taaki testing me baar-baar expire na ho
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (payload: { userId: string; email: string }) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string; email: string };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string; email: string };
};