import { categoryTemplates } from './categoryTemplates.js';
import { audienceInsights } from './audienceInsights.js';

export function buildPrompt({ eventName, eventTheme, targetAudience, location, eventDate, additionalInfo }) {
  const template = categoryTemplates[eventTheme] || {
    channels: ['Instagram', 'Facebook', 'Email'],
    contentFocus: 'event highlights and audience engagement',
    keyTactics: 'social media promotions and community outreach',
  };
  const audience = audienceInsights[targetAudience] || {
    platforms: 'Instagram, Facebook',
    tone: 'engaging and clear',
    bestTime: 'evenings',
  };

  const eventDateObj = new Date(eventDate);
  const daysUntilEvent = Math.max(1, Math.ceil((eventDateObj - new Date()) / (1000 * 60 * 60 * 24)));
  const weeksUntilEvent = Math.ceil(daysUntilEvent / 7);

  return `You are an expert event marketing strategist specializing in Sri Lankan events.
Generate a detailed, structured marketing plan for:
EVENT DETAILS:
- Event Name: ${eventName}
- Category: ${eventTheme}
- Target Audience: ${targetAudience}
- Location: ${location}
- Event Date: ${eventDateObj.toLocaleDateString('en-LK', { dateStyle: 'full' })}
- Days Until Event: ${daysUntilEvent} days (${weeksUntilEvent} weeks)
${additionalInfo ? `- Additional Notes: ${additionalInfo}` : ''}
TEMPLATE GUIDANCE:
- Recommended Channels: ${template.channels.join(', ')}
- Content Focus: ${template.contentFocus}
- Key Tactics: ${template.keyTactics}
- Audience Platforms: ${audience.platforms}
- Messaging Tone: ${audience.tone}
- Best Posting Times: ${audience.bestTime}
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
- Generate one week per week until the event (max 6 weeks)
- Each week must have 3-4 posts on different days
- Captions must be complete, ready-to-post, engaging Sri Lankan audience tone with emojis
- Each caption should be 4-6 lines long
- Hashtags: 10-15 per post, mix of popular + niche + location-based Sri Lankan hashtags
- Week themes should progress: Awareness → Engagement → Excitement → Urgency → Event Day
- Content types: Image Post, Video/Reel, Story, Carousel Post, Live Announcement`;
}
