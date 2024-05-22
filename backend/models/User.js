
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: String,
  state: String,
  houseNo: String,
  country: String,
  status: { type: String, default: 'valid' },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  addresses: [addressSchema],
});

module.exports = mongoose.model('User', userSchema);
