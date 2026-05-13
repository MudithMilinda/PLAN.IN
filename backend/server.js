import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import eventRoutes from './src/routes/eventRoutes.js';
import googleRoutes from './src/routes/googleAuth.js';
import analyticsRoutes from './src/routes/analytics.js';
import exportPdfRouter from "./api/exportPdf.js";
import './scheduler/telegramScheduler.js';
import telegramRoutes from './src/routes/telegramRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors());
app.use(express.json());

// Ensure req.body is always defined (DELETE requests without body, etc.)
// Must run before routes to be effective.
app.use((req, res, next) => {
  if (!req.body) req.body = {};
  next();
});

// Routes
app.use('/api', eventRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', telegramRoutes); 
app.use(googleRoutes);
app.use(exportPdfRouter); 

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


