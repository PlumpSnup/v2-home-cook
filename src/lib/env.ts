/**
 * The Postgres connection string. Vercel's Neon integration names it DATABASE_URL, but adds a
 * prefix (e.g. STORAGE_DATABASE_URL) when one was chosen while connecting, so accept those too.
 */
export function databaseUrl() {
  const exact = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (exact?.trim()) return exact.trim();
  for (const [key, value] of Object.entries(process.env)) {
    if (/_(DATABASE|POSTGRES)_URL$/.test(key) && value && /^postgres(ql)?:\/\//.test(value.trim())) {
      return value.trim();
    }
  }
  return "";
}

// Environment variables the app can't run without.
export function missingEnv() {
  const missing: string[] = [];
  if (!databaseUrl()) missing.push("DATABASE_URL");
  if (!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET)?.trim()) missing.push("AUTH_SECRET");
  return missing;
}

export const googleLoginEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
