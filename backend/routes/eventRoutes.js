import express from 'express';
import { getEvents, createEvent } from '../controllers/eventController.js';

const router = express.Router();

// Get events for user
router.post('/events', getEvents);

// Create new event
router.post('/events/create', createEvent);

export default router;