const { Schema, model } = require('mongoose');

const departmentSchema = new Schema(
  {
    office: { type: Schema.Types.ObjectId, ref: 'Office', required: true, index: true },
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

departmentSchema.index({ office: 1, name: 1 }, { unique: true });

module.exports = model('Department', departmentSchema);
