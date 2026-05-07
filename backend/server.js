import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { config } from './config.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import Candidate from './models/Candidate.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import electionRoutes from './routes/electionRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: config.frontendUrl }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(apiLimiter);

// Ensure upload folder exists and expose static uploads
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Database Connection
if (!config.mongoUri) {
  console.error('MongoDB URI is missing. Set MONGO_URI in .env.');
  process.exit(1);
}

const seedCandidates = async () => {
  try {
    const count = await Candidate.countDocuments();
    if (count === 0) {
      await Candidate.insertMany([
        {
          name: 'Narendra Modi',
          party: 'BJP',
          image: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Narendra_Modi_February_2022.jpg',
          isDeleted: false,
        },
        {
          name: 'Rahul Gandhi',
          party: 'Congress',
          image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Rahul_Gandhi_in_2019.jpg',
          isDeleted: false,
        },
        {
          name: 'Amit Shah',
          party: 'BJP',
          image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Amit_Shah_2019.jpg',
          isDeleted: false,
        },
        {
          name: 'Priyanka Gandhi',
          party: 'Congress',
          image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Priyanka_Gandhi_2018.png',
          isDeleted: false,
        },
      ]);
      console.log('🗳️ Seeded default candidates.');
    } else {
      console.log('🗳️ Candidate collection already has', count, 'entries.');
    }
  } catch (seedErr) {
    console.error('Failed to seed candidates:', seedErr);
  }
};

mongoose
  .connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    console.log('MongoDB connected');
    await seedCandidates();
  })
  .catch((err) => {
    console.error('MongoDB connection failed. Please check MONGO_URI and DNS.', err.message || err);
    console.error('Current MONGO_URI:', config.mongoUri);
    console.error('For local development you can set: mongodb://localhost:27017/evoting');
    process.exit(1);
  });

// Serve uploaded images (in local mode)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/election', electionRoutes);
app.use('/api/audit-log', auditRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
