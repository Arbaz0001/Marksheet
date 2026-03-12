import School from '../models/School.js';

export const createSchool = async (data) => {
  const school = await School.create(data);
  return school;
};

export const getAllSchools = async () => {
  return School.find().sort({ createdAt: -1 }).lean();
};

export const getSchoolById = async (id) => {
  return School.findById(id).lean();
};
