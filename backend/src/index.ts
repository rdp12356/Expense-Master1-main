import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Middleware to handle deviceId-based users
app.use(async (req, res, next) => {
  const deviceId = req.headers['x-device-id'] as string;
  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID required' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { deviceId },
      include: { settings: true }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { 
          deviceId,
          settings: {
            create: {} // defaults
          }
        },
        include: { settings: true }
      });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('User auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes
app.get('/sync', async (req: any, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id }
    });
    res.json({
      settings: req.user.settings,
      transactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

app.post('/transactions', async (req: any, res) => {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        ...req.body,
        userId: req.user.id,
        date: new Date(req.body.date)
      }
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.patch('/settings', async (req: any, res) => {
  try {
    const settings = await prisma.settings.update({
      where: { userId: req.user.id },
      data: req.body
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.listen(port, () => {
  console.log(`ExpenseMaster Backend running at http://localhost:${port}`);
});
