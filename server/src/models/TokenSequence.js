const { Schema, model } = require('mongoose');

// One document per (service, day). Booking does an atomic findOneAndUpdate with $inc
// on `seq`, which is how token numbers stay unique under concurrent requests (Step 4).
const tokenSequenceSchema = new Schema({
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true }, // 'YYYY-MM-DD'
  seq: { type: Number, default: 0 },
});

tokenSequenceSchema.index({ service: 1, date: 1 }, { unique: true });

module.exports = model('TokenSequence', tokenSequenceSchema);
