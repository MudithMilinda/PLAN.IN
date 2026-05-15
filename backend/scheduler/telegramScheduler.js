import cron from 'node-cron';
import { supabase } from '../src/config/supabase.js';
import { sendMessage, sendPhoto, sendVideo, sendMediaGroup } from '../src/services/telegramService.js';

function isVideoUrl(url) {
  return /\.(mp4|mov|webm|mkv|avi)(\?|$)/i.test(url || '');
}

function getColomboNowForSql() {
  // Build "YYYY-MM-DD HH:mm:ss" in Asia/Colombo so it matches DB local timestamp comparisons.
  const dt = new Date();
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(dt);

  const get = (type) => parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}:${get('second')}`;
}

// Every minute check 
cron.schedule('* * * * *', async () => {
  const now = getColomboNowForSql();

  // Due posts find 
  const { data: posts, error } = await supabase
    .from('scheduled_telegrams')
    .select('*')
    .eq('sent', false)
    .lte('scheduled_at', now);

  if (error) {
    console.error('Scheduler fetch error:', error.message);
    return;
  }

  if (!posts || posts.length === 0) {
    return;
  }

  console.log(`Telegram scheduler tick: ${now} | due posts: ${posts.length}`);

  for (const post of posts) {
    try {
      const { chat_id, message, media_urls } = post;
      const urls = Array.isArray(media_urls) ? media_urls : [];

      if (urls.length === 0) {
        await sendMessage(chat_id, message);
      } else if (urls.length === 1) {
        if (isVideoUrl(urls[0])) {
          await sendVideo(chat_id, urls[0], message);
        } else {
          await sendPhoto(chat_id, urls[0], message);
        }
      } else {
        await sendMediaGroup(chat_id, urls, message);
      }

      // Mark as sent
      const { error: updateError } = await supabase
        .from('scheduled_telegrams')
        .update({ sent: true, sent_at: new Date().toISOString() })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Failed to mark post ${post.id} as sent:`, updateError.message);
      } else {
        console.log(`✓ Sent post ${post.id} to chat ${chat_id}`);
      }

    } catch (err) {
      console.error(`Failed to send post ${post.id}:`, err.message);
    }
  }
}, { timezone: 'Asia/Colombo' });
