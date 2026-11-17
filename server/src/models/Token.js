const { Schema, model } = require('mongoose');

const STATUSES = ['Waiting', 'In Progress', 'Completed', 'Skipped', 'Cancelled'];

const tokenSchema = new Schema(
  {
    office: { type: Schema.Types.ObjectId, ref: 'Office', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    counter: { type: Schema.Types.ObjectId, ref: 'Counter', default: null },

    // Token identity. `date` is the office-local day as 'YYYY-MM-DD'.
    date: { type: String, required: true },
    sequence: { type: Number, required: true }, // 1, 2, 3 ... per service per day
    tokenNumber: { type: String, required: true }, // display form, e.g. "A-007"

    // Citizen details (sample citizen data from the spec)
    citizenName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },

    priority: { type: String, enum: ['Normal', 'Priority'], default: 'Normal' },
    status: { type: String, enum: STATUSES, default: 'Waiting', index: true },
    estimatedWaitMin: { type: Number, default: 0 },

    // Timestamps used for reports (average wait, tokens per counter, peak hours)
    bookedAt: { type: Date, default: Date.now },
    calledAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

// Conflict-free guarantee: no two tokens can share a sequence for the same service and day.
tokenSchema.index({ service: 1, date: 1, sequence: 1 }, { unique: true });
// Fast queue lookups
tokenSchema.index({ office: 1, date: 1, status: 1 });
tokenSchema.index({ mobile: 1, date: 1 });

tokenSchema.statics.STATUSES = STATUSES;

module.exports = model('Token', tokenSchema);
