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
import { deletePostMedia, uploadPostMedia } from '../controllers/uploadMediaController.js';

const router = express.Router();

router.use((req, res, next) => {
  if (!req.body) req.body = {};

  const fromQuery = req.query?.clerkUserId;
  const fromBody = req.body?.clerkUserId;
  const fromHeader = req.headers?.['x-clerk-user-id'];

  const resolved = fromBody || fromQuery || fromHeader;
  if (resolved) req.body.clerkUserId = resolved;

  const isPublicRoute =
    (req.method === 'GET' && req.path === '/events/count') ||
    (req.method === 'POST' && req.path === '/subscribe');

  const userLabel = isPublicRoute
    ? resolved || 'PUBLIC'
    : resolved || '❌ MISSING';

  console.log(`[${req.method}] ${req.path} | clerkUserId: ${userLabel}`);
  next();
});

router.post('/events', getEvents);
router.post('/content-posts', getContentPosts);
router.post('/events/create', createEvent);
router.post('/events/update', updateEvent);
router.post('/events/:id', getEventById);
router.delete('/events/:id', deleteEvent);


router.patch('/content-posts/:id', updateContentPost);
router.delete('/content-posts/:id', deleteContentPost);

router.post('/profile', getUserProfile);
router.put('/profile', upsertUserProfile);

// Media upload endpoint
router.post('/content-posts/:id/media', uploadPostMedia);
router.delete('/content-posts/:id/media', deletePostMedia);

// GET /api/events/count
router.get('/events/count', async (req, res) => {
  const { count, error } = await getTotalEventCount();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ count });
});

export default router;
