import mongoose from 'mongoose';

const examMarkSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    obtained: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const marksheetSubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    marks: { type: [examMarkSchema], required: true },
    total: { type: Number, required: true, default: 0 },
    maxTotal: { type: Number, required: true, default: 0 },
    divisionDescription: { type: String, required: true, default: '' },
    grade: { type: String, default: '' },
  },
  { _id: false }
);

const extraSubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    obtainedMarks: { type: Number, required: true, default: 0 },
    grade: { type: String, enum: ['A', 'B', 'C', 'D'], required: true, default: 'A' },
  },
  { _id: false }
);

const overallResultSchema = new mongoose.Schema(
  {
    totalMaxMarks: { type: Number, required: true },
    totalObtainedMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    overallDivision: { type: String, required: true },
    overallGrade: { type: String, default: '' },
    result: { type: String, required: true },
    positionInClass: { type: String, default: '' },
  },
  { _id: false }
);

const marksheetSchema = new mongoose.Schema(
  {
    // Reference to the school
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    // Denormalized school snapshot for historical accuracy
    schoolName: { type: String, required: true },
    schoolAddress: { type: String, required: true },
    schoolDISECode: { type: String, required: true },
    schoolCity: { type: String, default: '' },
    schoolState: { type: String, default: '' },
    pspCode: { type: String, default: '' },
    schoolCode: { type: String, default: '' },
    session: { type: String, required: true },
    examStructure: {
      type: [{ examName: String, maxMarks: Number }],
      required: true,
    },
    // Student info
    studentName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, trim: true, default: '' },
    rollNumber: { type: String, required: true, trim: true },
    scholarNumber: { type: String, required: true, trim: true },
    classSection: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true },
    // Marks
    subjects: { type: [marksheetSubjectSchema], required: true },
    extraSubjects: { type: [extraSubjectSchema], default: [] },
    // Calculated result
    overallResult: { type: overallResultSchema, required: true },
    useGradingSystem: { type: Boolean, default: true },
    gradingSystem: {
      type: [{ grade: String, range: String, description: String }],
      default: [],
    },
    // Attendance
    totalMeetings: { type: Number, default: 0 },
    studentMeetings: { type: Number, default: 0 },
    attendancePercentage: { type: Number, default: 0 },
    // Remarks
    remark: { type: String, default: '' },
    resultDate: { type: String, default: '' },
  },
  { timestamps: true }
);

const Marksheet = mongoose.model('Marksheet', marksheetSchema);
export default Marksheet;
