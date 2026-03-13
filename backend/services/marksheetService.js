import Marksheet from '../models/Marksheet.js';
import School from '../models/School.js';

const GRADING_SYSTEM = [
  { grade: 'A', range: '86-100', description: 'Excellent' },
  { grade: 'B', range: '71-85', description: 'Very Good' },
  { grade: 'C', range: '51-70', description: 'Good' },
  { grade: 'D', range: '31-50', description: 'Average' },
  { grade: 'E', range: '0-30', description: 'Need Improvement' },
];

const getDivisionDescription = (pct) => {
  if (pct >= 86) return 'Excellent';
  if (pct >= 71) return 'Very Good';
  if (pct >= 51) return 'Good';
  if (pct >= 31) return 'Average';
  return 'Need Improvement';
};

const getOverallGrade = (pct) => {
  if (pct >= 86) return 'A';
  if (pct >= 71) return 'B';
  if (pct >= 51) return 'C';
  if (pct >= 31) return 'D';
  return 'E';
};

export const createMarksheet = async (body) => {
  const school = await School.findById(body.school).lean();
  if (!school) throw new Error('School not found');

  // Calculate per-subject totals
  const subjects = (body.subjects || []).map((sub) => {
    const marks = (sub.marks || []).map((mark) => ({
      examName: mark.examName,
      maxMarks: Number(mark.maxMarks) || 0,
      obtained: Math.min(Math.max(Number(mark.obtained) || 0, 0), Number(mark.maxMarks) || 0),
    }));
    const total = marks.reduce((sum, m) => sum + m.obtained, 0);
    const maxTotal = marks.reduce((sum, m) => sum + m.maxMarks, 0);
    const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
    return {
      name: sub.name,
      marks,
      total,
      maxTotal,
      divisionDescription: getDivisionDescription(pct),
    };
  });

  const totalObtainedMarks = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalMaxMarks = subjects.reduce((sum, s) => sum + s.maxTotal, 0);
  const percentage =
    totalMaxMarks > 0
      ? Number(((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2))
      : 0;

  const overallResult = {
    totalMaxMarks,
    totalObtainedMarks,
    percentage,
    overallDivision: getDivisionDescription(percentage),
    overallGrade: getOverallGrade(percentage),
    result: percentage >= 31 ? 'Pass' : 'Fail',
    positionInClass: body.positionInClass || '',
  };

  const doc = await Marksheet.create({
    school: school._id,
    // Denormalized snapshot
    schoolName: school.name || school.schoolName,
    schoolAddress: school.address || school.schoolAddress,
    schoolDISECode: school.diseCode || school.schoolDISECode,
    schoolCity: school.city || '',
    schoolState: school.state || '',
    pspCode: school.pspCode || '',
    schoolCode: school.schoolCode || '',
    session: school.session,
    examStructure: school.examStructure,
    // Student
    studentName: body.studentName,
    fatherName: body.fatherName,
    motherName: body.motherName || '',
    rollNumber: body.rollNumber,
    scholarNumber: body.scholarNumber,
    classSection: body.classSection,
    dateOfBirth: body.dateOfBirth,
    // Marks
    subjects,
    extraSubjects: body.extraSubjects || [],
    overallResult,
    gradingSystem: GRADING_SYSTEM,
    // Attendance
    totalMeetings: Number(body.totalMeetings) || 0,
    studentMeetings: Number(body.studentMeetings) || 0,
    attendancePercentage: Number(body.attendancePercentage) || 0,
    remark: body.remark || '',
    resultDate: body.resultDate || '',
  });

  return doc;
};

export const getAllMarksheets = async (query = '') => {
  const filter = query
    ? {
        $or: [
          { studentName: { $regex: query, $options: 'i' } },
          { rollNumber: { $regex: query, $options: 'i' } },
          { classSection: { $regex: query, $options: 'i' } },
        ],
      }
    : {};
  return Marksheet.find(filter).sort({ createdAt: -1 }).lean();
};

export const getMarksheetById = async (id) => {
  return Marksheet.findById(id).lean();
};
