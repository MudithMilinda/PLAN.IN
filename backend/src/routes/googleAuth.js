import express from 'express';
import { oauth2Client } from '../config/googleOAuth.js';
import { getTokens, saveTokens } from '../services/googleCalendarService.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/auth/google', (req, res) => {
  const { clerkUserId } = req.query;
  if (!clerkUserId) return res.status(400).json({ error: 'clerkUserId required' });

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    state: clerkUserId,
    prompt: 'consent',
  });

  res.redirect(url);
});

router.get('/auth/google/callback', async (req, res) => {
  const { code, state: clerkUserId, error } = req.query;
  if (error) return res.redirect(`${process.env.FRONTEND_URL}/calendar?google_connected=false`);

  try {
    const { tokens } = await oauth2Client.getToken(code);
    await saveTokens(clerkUserId, tokens);
    res.redirect(`${process.env.FRONTEND_URL}/calendar?google_connected=true`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/calendar?google_connected=false`);
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
