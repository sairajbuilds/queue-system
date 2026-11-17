const { Schema, model } = require('mongoose');

// Staff and admins only. Citizens do not log in; they book with name + mobile.
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'staff'], required: true },
    office: { type: Schema.Types.ObjectId, ref: 'Office', required: true },
    assignedCounter: { type: Schema.Types.ObjectId, ref: 'Counter', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
