import * as schoolService from '../services/schoolService.js';

export const createSchool = async (req, res) => {
  try {
    const school = await schoolService.createSchool(req.body);
    return res.status(201).json(school);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create school', error: error.message });
  }
};

export const getSchools = async (req, res) => {
  try {
    const schools = await schoolService.getAllSchools();
    return res.json(schools);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch schools', error: error.message });
  }
};

export const getSchoolById = async (req, res) => {
  try {
    const school = await schoolService.getSchoolById(req.params.id);
    if (!school) return res.status(404).json({ message: 'School not found' });
    return res.json(school);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch school', error: error.message });
  }
};
