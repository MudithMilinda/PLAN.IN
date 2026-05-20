import express from 'express';
import { oauth2Client } from '../config/googleOAuth.js';
import { getTokens, saveTokens } from '../services/googleCalendarService.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

function normalizeReturnTo(returnTo) {
  if (!returnTo || typeof returnTo !== 'string') return '/calendar';
  return returnTo.startsWith('/') ? returnTo : '/calendar';
}

function getFrontendOrigin(req) {
  const fallback = process.env.FRONTEND_URL || 'https://planin.space';
  const origin = req.get('origin');
  const referer = req.get('referer');

  if (origin) return origin;
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

function buildStatePayload(clerkUserId, frontendOrigin, returnTo = '/calendar') {
  return Buffer.from(
    JSON.stringify({
      clerkUserId,
      frontendOrigin,
      returnTo: normalizeReturnTo(returnTo),
    })
  ).toString('base64url');
}

function parseStatePayload(rawState) {
  if (!rawState) return { clerkUserId: '', frontendOrigin: '', returnTo: '/calendar' };

  try {
    const parsed = JSON.parse(Buffer.from(String(rawState), 'base64url').toString('utf8'));
    return {
      clerkUserId: parsed?.clerkUserId || '',
      frontendOrigin: parsed?.frontendOrigin || '',
      returnTo: normalizeReturnTo(parsed?.returnTo),
    };
  } catch {
    // Backward compatibility: old state used plain clerkUserId string.
    return {
      clerkUserId: String(rawState),
      frontendOrigin: '',
      returnTo: '/calendar',
    };
  }
}

router.get('/auth/google', (req, res) => {
  const { clerkUserId, returnTo } = req.query;
  if (!clerkUserId) return res.status(400).json({ error: 'clerkUserId required' });

  const frontendOrigin = getFrontendOrigin(req);
  const state = buildStatePayload(clerkUserId, frontendOrigin, returnTo);

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    state,
    prompt: 'consent',
  });

  res.redirect(url);
});

router.get('/auth/google/callback', async (req, res) => {
  const { code, state, error } = req.query;
  const parsed = parseStatePayload(state);
  const frontendOrigin = parsed.frontendOrigin || process.env.FRONTEND_URL || 'https://planin.space';
  const redirectBase = `${frontendOrigin}${parsed.returnTo}`;

  if (error) return res.redirect(`${redirectBase}?google_connected=false`);

  try {
    const { tokens } = await oauth2Client.getToken(code);
    await saveTokens(parsed.clerkUserId, tokens);
    res.redirect(`${redirectBase}?google_connected=true`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect(`${redirectBase}?google_connected=false`);
  }
});

router.get('/api/google/status', async (req, res) => {
  const { clerkUserId } = req.query;
  if (!clerkUserId) return res.json({ connected: false });
  const tokens = await getTokens(clerkUserId);
  return res.json({ connected: !!tokens });
});

router.post('/api/google/disconnect', async (req, res) => {
  const { clerkUserId } = req.body;
  if (!clerkUserId) return res.status(400).json({ error: 'clerkUserId required' });

  try {
    const tokens = await getTokens(clerkUserId);
    if (tokens?.access_token) await oauth2Client.revokeToken(tokens.access_token).catch(() => {});
    await supabase.from('google_tokens').delete().eq('clerk_user_id', clerkUserId);
    return res.json({ success: true });
  } catch (err) {
    console.error('Disconnect error:', err);
    return res.status(500).json({ error: 'Failed to disconnect' });
  }
});

export default router;
