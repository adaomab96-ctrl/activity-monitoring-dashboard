/**
 * CRITICAL: This file is imported first in main.ts.
 * Sets NODE_TLS_REJECT_UNAUTHORIZED=0 before ANY other module loads.
 * This is required for Railway's PostgreSQL TLS proxy to work.
 */

// Set immediately — before any imports resolve
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env manually
try {
  const envPath = resolve(process.cwd(), '.env');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    // Always override DATABASE_URL to ensure fresh value
    if (key === 'DATABASE_URL' || !process.env[key]) {
      process.env[key] = val;
    }
  }
  console.log('✅ .env loaded | TLS disabled | DB:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]);
} catch {
  console.log('ℹ️  No .env file — using system environment variables');
}

// Re-affirm after .env load in case something overrode it
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
