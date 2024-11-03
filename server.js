const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques du build
app.use(express.static(path.join(__dirname, 'build')));

// Toutes les requêtes non API sont redirigées vers l'index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5003;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});