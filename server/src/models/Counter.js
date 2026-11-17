const { Schema, model } = require('mongoose');

// A physical service window/desk. One counter can serve several services.
const counterSchema = new Schema(
  {
    office: { type: Schema.Types.ObjectId, ref: 'Office', required: true, index: true },
    number: { type: Number, required: true, min: 1 },
    label: { type: String, trim: true },
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    status: { type: String, enum: ['Open', 'Paused', 'Closed'], default: 'Closed' },
    currentToken: { type: Schema.Types.ObjectId, ref: 'Token', default: null },
  },
  { timestamps: true }
);

counterSchema.index({ office: 1, number: 1 }, { unique: true });

module.exports = model('Counter', counterSchema);
