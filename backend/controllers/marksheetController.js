import * as marksheetService from '../services/marksheetService.js';

export const createMarksheet = async (req, res) => {
  try {
    const marksheet = await marksheetService.createMarksheet(req.body);
    return res.status(201).json(marksheet);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create marksheet', error: error.message });
  }
};

export const getMarksheets = async (req, res) => {
  try {
    const { query = '' } = req.query;
    const marksheets = await marksheetService.getAllMarksheets(query);
    return res.json(marksheets);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch marksheets', error: error.message });
  }
};

export const getMarksheetById = async (req, res) => {
  try {
    const marksheet = await marksheetService.getMarksheetById(req.params.id);
    if (!marksheet) return res.status(404).json({ message: 'Marksheet not found' });
    return res.json(marksheet);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch marksheet', error: error.message });
  }
};
