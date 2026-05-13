import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

function isVideoUrl(url) {
  return /\.(mp4|mov|webm|mkv|avi)(\?|$)/i.test(url || "");
}

export async function sendMessage(chatId, text) {
  return bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
}

export async function sendPhoto(chatId, photoUrl, caption) {
  return bot.sendPhoto(chatId, photoUrl, {
    caption,
    parse_mode: 'HTML'
  });
}

export async function sendVideo(chatId, videoUrl, caption) {
  return bot.sendVideo(chatId, videoUrl, {
    caption,
    parse_mode: 'HTML'
  });
}

export async function sendMediaGroup(chatId, mediaUrls, caption) {
  const media = mediaUrls.map((url, i) => ({
    type: isVideoUrl(url) ? 'video' : 'photo',
    media: url,
    caption: i === 0 ? caption : undefined,
    parse_mode: 'HTML'
  }));
  return bot.sendMediaGroup(chatId, media);
}
