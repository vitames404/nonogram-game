const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  username: {type: String, required: true},
  date: {type: Date, default: Date.now},
  time: {type: String, required: true,}
});

const Ranking = mongoose.model('Ranking', rankingSchema);

module.exports = Ranking;
