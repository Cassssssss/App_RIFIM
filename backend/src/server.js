const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('../config/db');
const apiRoutes = require('../routes/api');

const app = express();

// Configuration CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB();

// Routes API
app.use('/api', apiRoutes);

// Servir les fichiers statiques du build React
app.use(express.static(path.join(__dirname, '../build')));

// Toutes les autres requêtes sont redirigées vers l'index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});