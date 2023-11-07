const mongoose = require('mongoose');

const Gamechema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true, enum: ['active', 'inactive'] },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Set' }],
  guest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'gameDayNotes' }]
},
{ timestamps: true }
);

module.exports = mongoose.model('Game', Gamechema);
