import express from 'express';
import {
  getEvents,
  getContentPosts,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  updateContentPost,
  deleteContentPost,
} from '../controllers/eventsController.js';
import { getUserProfile, upsertUserProfile } from '../controllers/profileController.js';
import { getTotalEventCount } from '../services/eventService.js';

const router = express.Router();

router.use((req, res, next) => {
  if (!req.body) req.body = {};

  const fromQuery = req.query?.clerkUserId;
  const fromBody = req.body?.clerkUserId;
  const fromHeader = req.headers?.['x-clerk-user-id'];

  const resolved = fromBody || fromQuery || fromHeader;
  if (resolved) req.body.clerkUserId = resolved;

  console.log(`[${req.method}] ${req.path} | clerkUserId: ${resolved || '❌ MISSING'}`);
  next();
});

router.post('/events', getEvents);
router.post('/content-posts', getContentPosts);
router.post('/events/create', createEvent);
router.post('/events/update', updateEvent);
router.post('/events/:id', getEventById);
router.delete('/events/:id', deleteEvent);

router.put('/content-posts/:id', updateContentPost);
router.delete('/content-posts/:id', deleteContentPost);

router.post('/profile', getUserProfile);
router.put('/profile', upsertUserProfile);

// GET /api/events/count
router.get('/events/count', async (req, res) => {
  const { count, error } = await getTotalEventCount();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ count });
});

export default router;
