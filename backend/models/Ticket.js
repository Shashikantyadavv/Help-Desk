const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: String,
  status: { type: String, enum: ['Active', 'Pending', 'Closed'], default: 'Active' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastUpdated: { type: Date, default: Date.now },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Ticket', ticketSchema);
