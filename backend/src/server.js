const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('../config/db');
const apiRoutes = require('../routes/api');

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:5003', 'https://sea-turtle-app-srwkw.ondigitalocean.app'],
  credentials: true
}));

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB();

// Routes API d'abord
app.use('/api', apiRoutes);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../../build')));

// Toutes les autres routes vers index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

const port = process.env.PORT || 5002;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});