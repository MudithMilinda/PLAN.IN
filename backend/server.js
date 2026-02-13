import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', eventRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
