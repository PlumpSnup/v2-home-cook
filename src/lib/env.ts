// Environment variables the app can't run without.
export function missingEnv() {
  const missing: string[] = [];
  if (!(process.env.DATABASE_URL || process.env.POSTGRES_URL)?.trim()) missing.push("DATABASE_URL");
  if (!process.env.AUTH_SECRET?.trim()) missing.push("AUTH_SECRET");
  return missing;
}

export const googleLoginEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
