const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, 
  createdAt: { type: Date, default: Date.now }, 
  highscore: { type: String, default: "0" }, 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
