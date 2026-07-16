import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import userRoutes from './routes/userRoutes.js';
import quranRoutes from './routes/quranRoutes.js';
import mosqueRoutes from './routes/mosqueRoutes.js';
import zakatRoutes from './routes/zakatRoutes.js';
import familyRoutes from './routes/familyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Super App API is running',
    version: '1.0.0',
    status: 'healthy'
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quran', quranRoutes);
app.use('/api/mosques', mosqueRoutes);
app.use('/api/zakat', zakatRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
