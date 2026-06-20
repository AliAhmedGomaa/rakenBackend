const REQUIRED_ENV_KEYS = ['MONGODB_URI', 'JWT_SECRET'] as const;

/**
 * Validates env at boot. On Vercel/Railway/etc. you must set these in the
 * hosting dashboard — the local `.env` file is never deployed.
 */
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const missing = REQUIRED_ENV_KEYS.filter((key) => {
    const value = config[key] ?? process.env[key];
    return typeof value !== 'string' || value.trim() === '';
  });

  if (missing.length > 0) {
    throw new Error(
      [
        `Missing required environment variable(s): ${missing.join(', ')}`,
        'Add them in your host settings (e.g. Vercel → Project → Settings → Environment Variables).',
        'The local .env file is not included in production builds.',
        'See .env.example for the full list.',
      ].join(' '),
    );
  }

  return config;
}
