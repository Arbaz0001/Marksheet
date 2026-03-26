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

const parseRange = (rangeText = '') => {
  const match = String(rangeText)
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const min = Number(match[1]);
  const max = Number(match[2]);
  if (Number.isNaN(min) || Number.isNaN(max)) return null;
  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  };
};

const normalizeGradingSystem = (gradingSystem = []) =>
  (Array.isArray(gradingSystem) ? gradingSystem : [])
    .map((item) => ({
      grade: String(item.grade || '').trim(),
      range: String(item.range || '').trim(),
      description: String(item.description || '').trim(),
      parsedRange: parseRange(item.range),
    }))
    .filter((item) => item.grade && item.parsedRange)
    .map(({ parsedRange, ...item }) => ({
      ...item,
      parsedRange,
    }));

const resolveGradeFromSystem = (pct, gradingSystem = []) => {
  const matched = gradingSystem.find(
    (item) => pct >= item.parsedRange.min && pct <= item.parsedRange.max
  );
  return matched?.grade || '';
};

export const createMarksheet = async (body) => {
  const school = await School.findById(body.school).lean();
  if (!school) throw new Error('School not found');

  const useGradingSystem = body.useGradingSystem !== false;
  const normalizedGradingSystem = useGradingSystem
    ? normalizeGradingSystem(body.gradingSystem?.length ? body.gradingSystem : GRADING_SYSTEM)
    : [];
  const normalizedExamStructure = Array.isArray(body.examStructure)
    ? body.examStructure.map((exam) => ({
        examName: exam.examName,
        maxMarks: Math.max(Number(exam.maxMarks) || 0, 0),
      }))
    : school.examStructure;

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
      grade: useGradingSystem
        ? resolveGradeFromSystem(pct, normalizedGradingSystem) || getOverallGrade(pct)
        : '',
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
    overallGrade: useGradingSystem
      ? resolveGradeFromSystem(percentage, normalizedGradingSystem) || getOverallGrade(percentage)
      : '',
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
    examStructure: normalizedExamStructure,
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
    useGradingSystem,
    gradingSystem: useGradingSystem
      ? normalizedGradingSystem.map(({ grade, range, description }) => ({
          grade,
          range,
          description,
        }))
      : [],
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
