/** Mongoose options tuned for Vercel/serverless cold starts. */
export const mongooseServerlessOptions = {
  /** Fail fast instead of retrying until the gateway times out (504). */
  serverSelectionTimeoutMS: 8_000,
  connectTimeoutMS: 8_000,
  socketTimeoutMS: 20_000,
  /** One connection per warm container is enough on serverless. */
  maxPoolSize: 5,
  minPoolSize: 0,
  /** Re-use connections across warm invocations. */
  maxIdleTimeMS: 60_000,
} as const;
