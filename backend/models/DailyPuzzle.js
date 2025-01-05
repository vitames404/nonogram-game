const mongoose = require('mongoose');

const dailyPuzzleSchema = new mongoose.Schema({
  grid: [[Number]], // Daily grid
  rowHints: [[Number]], // Daily row hints
  colHints: [[Number]], // Daily col hints
  date: { type: String, unique: true }, // Current date
});

const DailyPuzzle = mongoose.model('DailyPuzzle', dailyPuzzleSchema);

module.exports = DailyPuzzle;