const { Schema, model } = require('mongoose');

// A bookable service, e.g. "Aadhaar Update" under the "Identity Services" department.
const serviceSchema = new Schema(
  {
    office: { type: Schema.Types.ObjectId, ref: 'Office', required: true, index: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    name: { type: String, required: true, trim: true },
    prefix: { type: String, required: true, uppercase: true, trim: true, maxlength: 3 }, // token label, e.g. "A" -> A-001
    avgDurationMin: { type: Number, required: true, min: 1, default: 10 }, // seed value for wait-time prediction
    dailyTokenLimit: { type: Number, required: true, min: 1, default: 100 },
    startTime: { type: String, default: '09:00' }, // service timings (HH:mm)
    endTime: { type: String, default: '17:00' },
    allowReschedule: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ office: 1, prefix: 1 }, { unique: true });
serviceSchema.index({ office: 1, name: 1 }, { unique: true });

module.exports = model('Service', serviceSchema);
