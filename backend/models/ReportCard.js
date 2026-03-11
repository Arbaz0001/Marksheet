<<<<<<< HEAD
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    maxMarks: { type: Number, default: 100 },
    firstTest: { type: Number, required: true },
    secondTest: { type: Number, required: true },
    thirdTest: { type: Number, required: true },
    testTotal: { type: Number, required: true },
    halfYearly: { type: Number, required: true },
    testPlusHYTotal: { type: Number, required: true },
    yearlyExam: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    divisionDescription: { type: String, required: true },
  },
  { _id: false }
);

const extraSubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    obtainedMarks: { type: Number, required: true },
    grade: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  },
  { _id: false }
);

const reportCardSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    schoolAddress: { type: String, required: true },
    session: { type: String, required: true },
    diseCode: { type: String, required: true },
    studentName: { type: String, required: true },
    scholarNumber: { type: String, required: true },
    fatherName: { type: String, required: true },
    classSection: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    rollNumber: { type: String, required: true },
    subjects: { type: [subjectSchema], required: true },
    extraSubjects: { type: [extraSubjectSchema], required: true },
    gradingSystem: {
      type: [
        {
          grade: String,
          range: String,
          description: String,
        },
      ],
      required: true,
    },
    overallResult: {
      totalMaxMarks: { type: Number, required: true },
      totalObtainedMarks: { type: Number, required: true },
      percentage: { type: Number, required: true },
      overallDivision: { type: String, required: true },
      overallGrade: { type: String, required: true },
      result: { type: String, required: true },
      positionInClass: { type: String, required: true },
    },
    totalMeetings: { type: Number, required: true },
    studentMeetings: { type: Number, required: true },
    remark: { type: String, required: true },
    resultDate: { type: String, required: true },
    attendancePercentage: { type: Number, required: true },
  },
  { timestamps: true }
);

const ReportCard = mongoose.model('ReportCard', reportCardSchema);

export default ReportCard;
=======
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    maxMarks: { type: Number, default: 100 },
    firstTest: { type: Number, required: true },
    secondTest: { type: Number, required: true },
    thirdTest: { type: Number, required: true },
    testTotal: { type: Number, required: true },
    halfYearly: { type: Number, required: true },
    testPlusHYTotal: { type: Number, required: true },
    yearlyExam: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    divisionDescription: { type: String, required: true },
  },
  { _id: false }
);

const extraSubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    obtainedMarks: { type: Number, required: true },
    grade: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  },
  { _id: false }
);

const reportCardSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    schoolAddress: { type: String, required: true },
    session: { type: String, required: true },
    diseCode: { type: String, required: true },
    studentName: { type: String, required: true },
    scholarNumber: { type: String, required: true },
    fatherName: { type: String, required: true },
    classSection: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    rollNumber: { type: String, required: true },
    subjects: { type: [subjectSchema], required: true },
    extraSubjects: { type: [extraSubjectSchema], required: true },
    gradingSystem: {
      type: [
        {
          grade: String,
          range: String,
          description: String,
        },
      ],
      required: true,
    },
    overallResult: {
      totalMaxMarks: { type: Number, required: true },
      totalObtainedMarks: { type: Number, required: true },
      percentage: { type: Number, required: true },
      overallDivision: { type: String, required: true },
      overallGrade: { type: String, required: true },
      result: { type: String, required: true },
      positionInClass: { type: String, required: true },
    },
    totalMeetings: { type: Number, required: true },
    studentMeetings: { type: Number, required: true },
    remark: { type: String, required: true },
    resultDate: { type: String, required: true },
    attendancePercentage: { type: Number, required: true },
  },
  { timestamps: true }
);

const ReportCard = mongoose.model('ReportCard', reportCardSchema);

export default ReportCard;
>>>>>>> ed0cc00c47b55670134b48d0f5650fb644776df4
