const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Sequelize, DataTypes, Model } = require('sequelize');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './expense_master.sqlite',
  logging: false,
});

// Models
class User extends Model {}
class Transaction extends Model {}
class Settings extends Model {}
class Simulation extends Model {}

User.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  deviceId: { type: DataTypes.STRING, unique: true, allowNull: false },
}, { sequelize, modelName: 'user' });

Transaction.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  type: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.STRING, allowNull: false },
  currency: { type: DataTypes.STRING, allowNull: false },
  emotion: { type: DataTypes.STRING },
  isBarter: { type: DataTypes.BOOLEAN, defaultValue: false },
  barterItem: { type: DataTypes.STRING },
}, { sequelize, modelName: 'transaction' });

Settings.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, unique: true, allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  language: { type: DataTypes.STRING, defaultValue: 'en' },
  theme: { type: DataTypes.STRING, defaultValue: 'system' },
  ghostRacingEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  financialAuraEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  appLockEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  incognitoMode: { type: DataTypes.BOOLEAN, defaultValue: false },
  onlineSyncEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { sequelize, modelName: 'settings' });

Simulation.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  habitName: { type: DataTypes.STRING, allowNull: false },
  dailyCost: { type: DataTypes.FLOAT, allowNull: false },
  projectedWealth: { type: DataTypes.FLOAT, allowNull: false },
  years: { type: DataTypes.INTEGER, defaultValue: 10 },
}, { sequelize, modelName: 'simulation' });

// Associations
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Settings, { foreignKey: 'userId' });
Settings.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Simulation, { foreignKey: 'userId' });
Simulation.belongsTo(User, { foreignKey: 'userId' });

app.use(cors());
app.use(express.json());

// Sync Database
sequelize.sync().then(() => {
  console.log('Database synchronized');
});

// Middleware to handle deviceId-based users
app.use(async (req, res, next) => {
  const deviceId = req.headers['x-device-id'];
  if (!deviceId) {
    return res.status(400).json({ error: 'Device ID required' });
  }

  try {
    let user = await User.findOne({ where: { deviceId }, include: [Settings] });

    if (!user) {
      user = await User.create({ deviceId });
      await Settings.create({ userId: user.id });
      user = await User.findOne({ where: { id: user.id }, include: [Settings] });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('User auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes
app.get('/sync', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ where: { userId: req.user.id } });
    res.json({
      settings: req.user.settings,
      transactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

app.post('/transactions', async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.patch('/settings', async (req, res) => {
  try {
    await Settings.update(req.body, { where: { userId: req.user.id } });
    const updatedSettings = await Settings.findOne({ where: { userId: req.user.id } });
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.post('/simulations', async (req, res) => {
  try {
    const simulation = await Simulation.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(simulation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to share simulation' });
  }
});

app.get('/simulations/:id', async (req, res) => {
  try {
    const simulation = await Simulation.findByPk(req.params.id);
    if (!simulation) return res.status(404).json({ error: 'Simulation not found' });
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/benchmarks', async (req, res) => {
  try {
    const stats = await Transaction.findAll({
      attributes: [
        'emotion',
        [sequelize.fn('AVG', sequelize.col('amount')), 'avgAmount'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['emotion']
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate benchmarks' });
  }
});

app.listen(port, () => {
  console.log(`ExpenseMaster Backend running at http://localhost:${port}`);
});
