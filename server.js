const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Configuration CORS
app.use(cors());

// Servir les fichiers statiques du build
app.use(express.static(path.join(__dirname, 'build')));

// Toutes les requêtes sont redirigées vers l'index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5003;
app.listen(port, () => {
  console.log(`Frontend server is running on port ${port}`);
});