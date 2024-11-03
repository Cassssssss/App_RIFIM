console.log('Starting server...');
require('dotenv').config();
console.log('Environment loaded');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const express = require('express');
console.log('Express loaded');
const cors = require('cors');
console.log('CORS loaded');
const connectDB = require('./config/db');
console.log('DB config loaded');
const apiRoutes = require('./routes/api');
console.log('Routes loaded');

const app = express();
console.log('Express app created');

// Connexion à la base de données
try {
  console.log('Attempting to connect to database...');
  connectDB();
  console.log('Database connection initialized');
} catch (error) {
  console.error('Error during database connection:', error);
}

// Middleware
app.use(cors());
console.log('CORS middleware added');
app.use(express.json());
console.log('JSON middleware added');

// Routes
app.use('/api', apiRoutes);
console.log('Routes middleware added');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});