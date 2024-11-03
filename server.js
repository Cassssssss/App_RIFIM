const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import des configs et routes du backend
const connectDB = require('./backend/config/db');
const apiRoutes = require('./backend/routes/api');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
try {
  console.log('Attempting to connect to database...');
  connectDB();
  console.log('Database connection initialized');
  console.log('MongoDB URI:', process.env.MONGODB_URI);
} catch (error) {
  console.error('Error during database connection:', error);
}

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes API
app.use('/api', apiRoutes);
console.log('API routes mounted at /api');

// Servir les fichiers statiques du build React
app.use(express.static(path.join(__dirname, 'build')));
console.log('Serving static files from:', path.join(__dirname, 'build'));

// Toutes les autres routes servent l'app React
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  console.log(`API accessible at http://localhost:${port}/api`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Ne pas terminer le processus en production
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});