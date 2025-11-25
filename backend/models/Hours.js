const mongoose = require('mongoose');

const hoursSchema = new mongoose.Schema({
  day: { type: String, required: true },
  open: { type: String, default: '' },
  close: { type: String, default: '' },
  closed: { type: Boolean, default: false },
  order: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Hours', hoursSchema);