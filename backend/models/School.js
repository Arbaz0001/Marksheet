import mongoose from 'mongoose';

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
    schoolName: { type: String, required: true, trim: true },
    schoolAddress: { type: String, required: true, trim: true },
    schoolDISECode: { type: String, required: true, trim: true },
    session: { type: String, required: true, trim: true },
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

const School = mongoose.model('School', schoolSchema);
export default School;
