import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { refreshTokens } from "../db/schema";

// Raw refresh tokens kabhi DB mein store nahi hote — hamesha hash. Isse agar
// database leak ho bhi jaye, tokens directly use nahi ho sakte.
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class TokenRepository {
  static async store(userId: string, token: string, expiresAt: Date) {
    const tokenHash = hashToken(token);
    await db.insert(refreshTokens).values({ userId, tokenHash, expiresAt });
  }

  // Token valid hai (exists, not revoked, not expired) to row return karta hai — warna null.
  static async findValid(token: string) {
    const tokenHash = hashToken(token);
    const [row] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash));

    if (!row) return null;
    if (row.isRevoked) return null;
    if (new Date() > new Date(row.expiresAt)) return null;

    return row;
  }

  static async revoke(token: string) {
    const tokenHash = hashToken(token);
    await db
      .update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.tokenHash, tokenHash));
  }

  // Logout-from-all-devices jaisa feature future mein chahiye to ye kaam aayega
  static async revokeAllForUser(userId: string) {
    await db
      .update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.userId, userId));
  }
}