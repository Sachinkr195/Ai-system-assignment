import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import catalogRoutes from './routes/catalogRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';

const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ifa-ems-backend' });
});

app.use('/api/catalog', catalogRoutes);
app.use('/api/proposals', proposalRoutes);

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI;

async function start() {
  if (!mongoUri) {
    // Fail fast so that we do not silently run without persistence.
    // The frontend will still show a clear error from the API.
    console.error('MONGO_URI is not set. Please configure it in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`IFA-EMS backend listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start backend', err);
    process.exit(1);
  }
}

start();
