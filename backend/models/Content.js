const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['measure', 'classification'], 
    required: true 
  },
  folderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Folder'
    // Optionnel pour permettre des fiches sans dossier
  },
  description: String,
  images: [{
    url: String,
    caption: String
  }],
  locationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Content', contentSchema);