import { oauth2Client, calendarFactory } from '../config/googleOAuth.js';
import { supabase } from '../config/supabase.js';

export async function getTokens(clerkUserId) {
  const { data, error } = await supabase
    .from('google_tokens')
    .select('access_token, refresh_token, expiry_date')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function saveTokens(clerkUserId, tokens) {
  const updateData = {
    clerk_user_id: clerkUserId,
    access_token: tokens.access_token,
    expiry_date: tokens.expiry_date,
  };

  if (tokens.refresh_token) updateData.refresh_token = tokens.refresh_token;

  const { error } = await supabase
    .from('google_tokens')
    .upsert(updateData, { onConflict: 'clerk_user_id' });

  if (error) throw error;
}

export async function getCalendarClient(clerkUserId) {
  const tokens = await getTokens(clerkUserId);
  if (!tokens) return null;

  oauth2Client.setCredentials(tokens);

  if (tokens.expiry_date && Date.now() > tokens.expiry_date - 5 * 60 * 1000 && tokens.refresh_token) {
    // refreshAccessToken() reads refresh_token from setCredentials above and
    // returns { credentials, res }. (refreshToken(rt) returns { tokens, res } —
    // different shape, easy to confuse.)
    const { credentials } = await oauth2Client.refreshAccessToken();
    await saveTokens(clerkUserId, credentials);
    oauth2Client.setCredentials({ ...tokens, ...credentials, refresh_token: tokens.refresh_token });
  }

  return calendarFactory(oauth2Client);
}

export function buildContentPostDescription({ weekTheme, platform, postType, contentDescription, caption, hashtags }) {
  return [
    `📌 ${weekTheme}`,
    `📱 Platform: ${platform}`,
    `🎨 Type: ${postType}`,
    '',
    '📝 Content:',
    contentDescription,
    '',
    '✍️ Caption:',
    caption,
    '',
    '#️⃣ Hashtags:',
    hashtags,
  ].join('\n');
}

export async function createMainEvent(calendarClient, payload) {
  const response = await calendarClient.events.insert({
    calendarId: 'primary',
    requestBody: payload,
  });
  console.log(`✅ Main event synced to Google: ${response.data.id}`);
  return response;
}

export async function createChildEvent(calendarClient, payload) {
  return calendarClient.events.insert({
    calendarId: 'primary',
    requestBody: payload,
  });
}

export async function listChildEventsByParent(calendarClient, parentEventId) {
  return calendarClient.events.list({
    calendarId: 'primary',
    privateExtendedProperty: `parentEventId=${parentEventId}`,
    maxResults: 250,
  });
}

export async function deleteChildEventsByParent(calendarClient, parentEventId) {
  const linkedEventsRes = await listChildEventsByParent(calendarClient, parentEventId);
  const childEvents = linkedEventsRes.data.items || [];

  const deleteResults = await Promise.allSettled(
    childEvents.map((ev) => calendarClient.events.delete({ calendarId: 'primary', eventId: ev.id }))
  );

  const deletedCount = deleteResults.filter(
    (r) => r.status === 'fulfilled' || r.reason?.code === 410
  ).length;

  console.log(`✅ ${deletedCount}/${childEvents.length} linked calendar events deleted`);
  return { deletedCount, totalCount: childEvents.length };
}

export async function deleteMainEvent(calendarClient, eventId) {
  try {
    await calendarClient.events.delete({ calendarId: 'primary', eventId });
    return true;
  } catch (error) {
    if (error?.code === 410) return true;
    throw error;
  }
}

export async function updateCalendarEvent(calendarClient, eventId, requestBody) {
  return calendarClient.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody,
  });
}
