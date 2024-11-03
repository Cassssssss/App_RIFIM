require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5003;

// Configuration de CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5003' 
      : process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
  app.use(cors(corsOptions));

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://sea-turtle-app-srwkw.ondigitalocean.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Gestion des erreurs CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Connexion à la base de données
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Connexion à MongoDB établie');

    // Routes API
    app.use('/api', apiRoutes);

    // Gestion des erreurs 404
    app.use((req, res) => {
      res.status(404).json({ message: 'Route non trouvée' });
    });

    // Gestion globale des erreurs
    app.use((err, req, res, next) => {
      console.error('Erreur serveur:', err.stack);
      res.status(err.status || 500).json({
        message: err.message || 'Erreur serveur interne',
        error: process.env.NODE_ENV === 'development' ? err : {}
      });
    });

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur le port ${PORT}`);
      console.log(`📡 API accessible sur http://localhost:${PORT}/api`);
      console.log(`🌐 CORS autorisé pour: ${corsOptions.origin}`);
    });

  } catch (error) {
    console.error('❌ Erreur de démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  // Ne pas terminer le processus en production
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Démarrage du serveur
startServer();

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu. Arrêt gracieux...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu. Arrêt gracieux...');
  process.exit(0);
});

module.exports = app; // Pour les tests