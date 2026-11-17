const { Schema, model } = require('mongoose');

// One physical government office / service centre.
// Every other collection hangs off an office, which keeps the system multi-office ready.
const officeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    openTime: { type: String, default: '09:00' }, // HH:mm
    closeTime: { type: String, default: '17:00' }, // HH:mm
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model('Office', officeSchema);
