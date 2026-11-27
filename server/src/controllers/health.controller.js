import { isDBConnected } from '../config/db.js';
import { env } from '../config/env.js';

export const getHealth = (_req, res) => {
  res.status(200).json({
    ok: true,
    dbConnected: isDBConnected(),
    provider: 'gemini',
    model: env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
  });
};
