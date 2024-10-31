export const ACCESS_TOKEN_EXP = 30 * 86400; // 30 days

const url =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL;
export const API_URL = `${process.env.NEXT_PUBLIC_PROTOCOL}://${url}/api`;
