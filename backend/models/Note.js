const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: String,
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  authorName: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
