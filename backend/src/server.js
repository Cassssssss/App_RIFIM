const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('../config/db');
const apiRoutes = require('../routes/api');

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:5003', 'http://localhost:5002', 'http://localhost:3000'],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
connectDB();

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes API
app.use('/api', apiRoutes);

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
  console.log(`API accessible at http://localhost:${port}/api`);
});