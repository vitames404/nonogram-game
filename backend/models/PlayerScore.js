const mongoose = require('mongoose');

const playerScoreSchema = new mongoose.Schema({
  username: String, // Player score
  timeTaken: Number, // Time he took to complete
  date: String, // Current date
});

module.exports = mongoose.model('PlayerScore', playerScoreSchema);