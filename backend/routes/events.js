// pages/api/events.js or server/routes/events.js
import { supabase } from '../supabaseClient.js';

export const getEvents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id, event_name, location, event_date, event_theme')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    res.status(200).json({ events: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
