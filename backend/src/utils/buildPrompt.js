import { categoryTemplates } from './categoryTemplates.js';
import { audienceInsights } from './audienceInsights.js';

export function buildPrompt({ eventName, eventTheme, targetAudience, duration, location, eventDate, additionalInfo }) {
  const template = categoryTemplates[eventTheme] || {
    channels: ['Instagram', 'Facebook', 'WhatsApp'],
    contentFocus: 'event highlights and audience engagement',
    keyTactics: 'social media promotions and community outreach',
  };

  // ── targetAudience array → merged insights ────────────────────────────────
  const audienceArray = Array.isArray(targetAudience) ? targetAudience : [targetAudience];

  // සියලුම selected audiences වල platforms, tones, bestTimes collect කරනවා
  const allPlatforms = new Set();
  const allTones     = new Set();
  const allBestTimes = new Set();

  audienceArray.forEach((aud) => {
    const insight = audienceInsights[aud];
    if (insight) {
      insight.platforms.split(',').forEach((p) => allPlatforms.add(p.trim()));
      allTones.add(insight.tone);
      allBestTimes.add(insight.bestTime);
    }
  });

  // Fallback if no matches found
  const mergedPlatforms = allPlatforms.size > 0
    ? [...allPlatforms].join(', ')
    : 'Instagram, Facebook, WhatsApp';
  const mergedTone = allTones.size > 0
    ? [...allTones].join(' / ')
    : 'engaging and clear';
  const mergedBestTime = allBestTimes.size > 0
    ? [...allBestTimes].join(' / ')
    : 'evenings and weekends';

  // Prompt එකේ දාන්න audience string
  const audienceStr = audienceArray.join(', ');

  // ── Date calculations ─────────────────────────────────────────────────────
  const eventDateObj = new Date(eventDate);
  const daysUntilEvent = Math.max(1, Math.ceil((eventDateObj - new Date()) / (1000 * 60 * 60 * 24)));
  const weeksUntilEvent = Math.ceil(daysUntilEvent / 7);

  const durationWeekMap = {
    'Half Day (< 4 hours)': 1,
    '1 Day': 1,
    '2–3 Days': 1,
    '1 Week Campaign': 1,
    '2 Week Campaign': 2,
    '1 Month Campaign': 4,
    'Ongoing / Recurring': 6,
  };
  const maxCalendarWeeks = Math.min(
    durationWeekMap[duration] ?? 6,
    weeksUntilEvent,
    6
  );

  const locationStr = [location.venue, location.city, location.country]
    .filter(Boolean)
    .join(', ');

  return `You are an expert event marketing strategist specializing in Sri Lankan events.
Generate a detailed, structured marketing plan for:

EVENT DETAILS:
- Event Name: ${eventName}
- Category: ${eventTheme}
- Target Audience: ${audienceStr}
- Number of Target Segments: ${audienceArray.length}
- Duration: ${duration}
- Location: ${locationStr}
- Event Date: ${eventDateObj.toLocaleDateString('en-LK', { dateStyle: 'full' })}
- Days Until Event: ${daysUntilEvent} days (${weeksUntilEvent} weeks)
${additionalInfo ? `- Additional Notes: ${additionalInfo}` : ''}

TEMPLATE GUIDANCE:
- Recommended Channels: ${template.channels.join(', ')}
- Content Focus: ${template.contentFocus}
- Key Tactics: ${template.keyTactics}
- Audience Platforms: ${mergedPlatforms}
- Messaging Tone: ${mergedTone}
- Best Posting Times: ${mergedBestTime}

MULTI-AUDIENCE NOTE:
${audienceArray.length > 1
  ? `This event targets ${audienceArray.length} distinct audience segments: ${audienceStr}.
Tailor content ideas, captions, and channel strategies to appeal to ALL these segments.
Where possible, suggest segment-specific content variations.`
  : `This event targets: ${audienceStr}.`
}

Respond ONLY with a valid JSON object in this exact format (no extra text, no markdown):
{
  "summary": "2-3 sentence strategy overview",
  "channels": [{"name":"channel name","priority":"High or Medium or Low","strategy":"specific strategy","contentTypes":["type1","type2"]}],
  "timeline": [{"phase":"phase name","duration":"e.g. Week 1-2","focus":"main focus","tasks":["task1","task2","task3"]}],
  "budgetAllocation": [{"category":"category name","percentage":30,"description":"what this covers"}],
  "contentIdeas": [{"type":"content type","idea":"specific idea","platform":"best platform"}],
  "keyMessages": ["message1","message2","message3"],
  "successMetrics": ["metric1","metric2","metric3"],
  "quickWins": ["action1","action2","action3"],
  "weeklyContentCalendar": [{"week":"Week 1","theme":"Awareness / Coming Soon","posts":[{"day":"Monday","type":"Image Post","platform":"Instagram","contentDescription":"What the post should show visually","caption":"Full ready-to-use caption text here (around 4-6 lines, engaging, with emojis)","hashtags":"#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5"}]}]
}

IMPORTANT for weeklyContentCalendar:
- Generate exactly ${maxCalendarWeeks} week(s) based on the event duration (${duration}) and days until event
- Each week must have 3-4 posts on different days
- Captions must be complete, ready-to-post, engaging Sri Lankan audience tone with emojis
- Each caption should be 4-6 lines long
- Hashtags: 10-15 per post, mix of popular + niche + location-based Sri Lankan hashtags
- Week themes should progress: Awareness → Engagement → Excitement → Urgency → Event Day
- Content types: Image Post, Video/Reel, Story, Carousel Post, Live Announcement
- The event is in ${location.city}${location.country ? `, ${location.country}` : ''} — use location-specific hashtags
- Since there are multiple target audiences (${audienceStr}), vary post styles to speak to different segments`;
}