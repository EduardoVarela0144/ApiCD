const mongoose = require('mongoose');

const Options = new mongoose.Schema({
  option: { type: String, },
  answer: { type: Boolean, default: false},
});

const QuestionSchema = new mongoose.Schema({
  question: { type: String},
  options: [Options],
  hint: { type: String},
});

const SetSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String},
  description: { type: String },
  status: { type: String, required: true, enum: ['active', 'inactive'] },
  questions: [QuestionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Set', SetSchema);