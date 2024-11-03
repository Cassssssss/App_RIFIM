const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques du build
app.use(express.static(path.join(__dirname, 'build')));

// Gérer toutes les autres routes en servant index.html
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});