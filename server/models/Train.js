const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    unique: true
  },
  trainName: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  days: {
    type: [String],
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  totalSeats: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Train', TrainSchema);