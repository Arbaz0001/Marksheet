import School from '../models/School.js';

const digitsOnlyPattern = /^\d+$/;

const normalizeSchoolPayload = (data) => {
  const name = String(data.name || data.schoolName || '').trim();
  const address = String(data.address || data.schoolAddress || '').trim();
  const city = String(data.city || '').trim();
  const state = String(data.state || '').trim();
  const diseCode = String(data.diseCode || data.schoolDISECode || '').trim();
  const pspCode = String(data.pspCode || '').trim();
  const schoolCode = String(data.schoolCode || '').trim();
  const session = String(data.session || '').trim();
  const examStructure = Array.isArray(data.examStructure) ? data.examStructure : [];
  const subjectStructure = Array.isArray(data.subjectStructure) ? data.subjectStructure : [];

  if (!name || !address || !city || !state || !diseCode || !pspCode || !schoolCode || !session) {
    throw new Error('All school fields are required.');
  }

  if (!digitsOnlyPattern.test(pspCode) || !digitsOnlyPattern.test(schoolCode)) {
    throw new Error('PSP Code and School Code must contain digits only.');
  }

  if (examStructure.length === 0) {
    throw new Error('At least one exam type is required.');
  }

  if (subjectStructure.length === 0) {
    throw new Error('At least one subject is required.');
  }

  return {
    name,
    address,
    city,
    state,
    diseCode,
    pspCode,
    schoolCode,
    session,
    schoolName: name,
    schoolAddress: address,
    schoolDISECode: diseCode,
    examStructure: examStructure.map((exam) => ({
      examName: String(exam.examName || '').trim(),
      maxMarks: Number(exam.maxMarks) || 0,
    })),
    subjectStructure: subjectStructure.map((subject) => ({
      name: String(subject.name || '').trim(),
    })),
  };
};

const formatSchoolResponse = (school) => {
  if (!school) {
    return school;
  }

  return {
    ...school,
    name: school.name || school.schoolName || '',
    address: school.address || school.schoolAddress || '',
    city: school.city || '',
    state: school.state || '',
    diseCode: school.diseCode || school.schoolDISECode || '',
    pspCode: school.pspCode || '',
    schoolCode: school.schoolCode || '',
    schoolName: school.name || school.schoolName || '',
    schoolAddress: school.address || school.schoolAddress || '',
    schoolDISECode: school.diseCode || school.schoolDISECode || '',
  };
};

export const createSchool = async (data) => {
  const school = await School.create(normalizeSchoolPayload(data));
  return formatSchoolResponse(school.toObject());
};

export const getAllSchools = async () => {
  const schools = await School.find().sort({ createdAt: -1 }).lean();
  return schools.map(formatSchoolResponse);
};

export const getSchoolById = async (id) => {
  const school = await School.findById(id).lean();
  return formatSchoolResponse(school);
};

export const updateSchool = async (id, data) => {
  const school = await School.findByIdAndUpdate(id, normalizeSchoolPayload(data), {
    new: true,
    runValidators: true,
  }).lean();
  return formatSchoolResponse(school);
};

export const deleteSchool = async (id) => {
  return School.findByIdAndDelete(id).lean();
};
