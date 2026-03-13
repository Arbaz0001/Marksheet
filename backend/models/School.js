import mongoose from 'mongoose';

const numericString = {
  validator: (value) => /^\d+$/.test(String(value || '')),
  message: 'Value must contain only digits.',
};

const examStructureSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true, trim: true },
    maxMarks: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const subjectItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    diseCode: { type: String, required: true, trim: true },
    pspCode: {
      type: String,
      required: true,
      trim: true,
      validate: numericString,
    },
    schoolCode: {
      type: String,
      required: true,
      trim: true,
      validate: numericString,
    },
    session: { type: String, required: true, trim: true },
    schoolName: { type: String, trim: true },
    schoolAddress: { type: String, trim: true },
    schoolDISECode: { type: String, trim: true },
    examStructure: {
      type: [examStructureSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one exam type is required.',
      },
    },
    subjectStructure: {
      type: [subjectItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one subject is required.',
      },
    },
  },
  { timestamps: true }
);

schoolSchema.pre('validate', function syncLegacyFields(next) {
  this.schoolName = this.name || this.schoolName;
  this.schoolAddress = this.address || this.schoolAddress;
  this.schoolDISECode = this.diseCode || this.schoolDISECode;

  if (!this.name && this.schoolName) {
    this.name = this.schoolName;
  }
  if (!this.address && this.schoolAddress) {
    this.address = this.schoolAddress;
  }
  if (!this.diseCode && this.schoolDISECode) {
    this.diseCode = this.schoolDISECode;
  }

  next();
});

const School = mongoose.model('School', schoolSchema);
export default School;
