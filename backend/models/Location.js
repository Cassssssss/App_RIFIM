const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  systemId: { type: mongoose.Schema.Types.ObjectId, ref: 'System', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', locationSchema);