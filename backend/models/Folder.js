const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  locationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['measure', 'classification'], 
    required: true 
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Folder', folderSchema);