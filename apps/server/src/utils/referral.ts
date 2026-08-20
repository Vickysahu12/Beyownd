export function generateReferralCode(name?: string): string {
  const prefix = (name?.replace(/[^a-zA-Z]/g, "").slice(0, 4) || "BYND").toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}${random}`;
}