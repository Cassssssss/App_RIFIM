const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('../config/db');
const apiRoutes = require('../routes/api');

const app = express();

// Configuration CORS
app.use(cors({
  origin: [
    'http://localhost:5003', 
    'https://sea-turtle-app-srwkw.ondigitalocean.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB();

// Routes API
app.use('/api', apiRoutes);

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});