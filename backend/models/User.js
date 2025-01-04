const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Added validation
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Added new field
  createdAt: { type: Date, default: Date.now }, // Added new field with default value
});

const User = mongoose.model('User', userSchema);

module.exports = User;