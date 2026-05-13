import express from 'express';
import { supabase } from '../config/supabase.js'; 

const router = express.Router();

function buildTelegramMessage(caption, hashtags, fallback = '') {
  return [caption, hashtags].filter(Boolean).join('\n\n').trim() || fallback;
}

// ── Add Telegram Group ──────────────────────────────
router.post('/telegram/groups', async (req, res) => {
  const { clerkUserId, groupName, chatId } = req.body;

  if (!clerkUserId || !groupName || !chatId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('telegram_groups')
    .insert({
      clerk_user_id: clerkUserId,
      group_name: groupName,
      chat_id: chatId,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Get User's Groups ───────────────────────────────
// ── Get All Groups (all users see same groups) ──
router.get('/telegram/groups', async (req, res) => {
  const { data, error } = await supabase
    .from('telegram_groups')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── Delete Group ────────────────────────────────────
router.delete('/telegram/groups/:id', async (req, res) => {
  const { clerkUserId } = req.body;

  const { error } = await supabase
    .from('telegram_groups')
    .delete()
    .eq('id', req.params.id)
    .eq('clerk_user_id', clerkUserId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// ── Schedule Post ───────────────────────────────────
router.post('/telegram/schedule', async (req, res) => {
  const { clerkUserId, postId, chatIds, message, mediaUrls, scheduledAt } = req.body;

  if (!clerkUserId || !chatIds?.length || !scheduledAt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let finalMessage = message || '';
  let finalMediaUrls = Array.isArray(mediaUrls) ? mediaUrls : [];

  if (postId) {
    const normalizedPostId =
      typeof postId === 'string' && postId.startsWith('content-')
        ? postId.substring(8)
        : postId;

    const { data: postData, error: postError } = await supabase
      .from('content_posts')
      .select('caption, hashtags, media_urls')
      .eq('id', normalizedPostId)
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (!postError && postData) {
      finalMessage = buildTelegramMessage(postData.caption, postData.hashtags, finalMessage);
      finalMediaUrls = Array.isArray(postData.media_urls) ? postData.media_urls : finalMediaUrls;
    }
  }

  const rows = chatIds.map((chatId) => ({
    post_id: postId,
    clerk_user_id: clerkUserId,
    chat_id: chatId,
    message: finalMessage,
    media_urls: finalMediaUrls,
    scheduled_at: scheduledAt,
  }));

  const { error } = await supabase
    .from('scheduled_telegrams')
    .insert(rows);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ scheduled: chatIds.length });
});

// ── Get Scheduled Posts For a Content Post ─────────
router.get('/telegram/schedules', async (req, res) => {
  const { clerkUserId, postId } = req.query;

  if (!clerkUserId || !postId) {
    return res.status(400).json({ error: 'Missing required query params' });
  }

  const normalizedPostId =
    typeof postId === 'string' && postId.startsWith('content-')
      ? postId.substring(8)
      : postId;

  const { data: schedules, error } = await supabase
    .from('scheduled_telegrams')
    .select('id, chat_id, scheduled_at, sent, sent_at, created_at')
    .eq('clerk_user_id', clerkUserId)
    .eq('post_id', normalizedPostId)
    .order('scheduled_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const chatIds = [...new Set((schedules || []).map((s) => s.chat_id).filter(Boolean))];
  let groupNameByChatId = new Map();

  if (chatIds.length) {
    const { data: groups } = await supabase
      .from('telegram_groups')
      .select('chat_id, group_name')
      .in('chat_id', chatIds);

    groupNameByChatId = new Map((groups || []).map((g) => [g.chat_id, g.group_name]));
  }

  const merged = (schedules || []).map((s) => ({
    ...s,
    group_name: groupNameByChatId.get(s.chat_id) || s.chat_id,
  }));

  res.json(merged);
});

// ── Delete Scheduled Telegram Row ───────────────────
router.delete('/telegram/schedules/:id', async (req, res) => {
  const { clerkUserId } = req.body;
  const { id } = req.params;

  if (!clerkUserId || !id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { error } = await supabase
    .from('scheduled_telegrams')
    .delete()
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
