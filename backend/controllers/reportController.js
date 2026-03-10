import ReportCard from '../models/ReportCard.js';

export const createReportCard = async (req, res) => {
  try {
    const reportCard = await ReportCard.create(req.body);
    res.status(201).json(reportCard);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create report card', error: error.message });
  }
};

export const getReportCards = async (req, res) => {
  try {
    const { query = '' } = req.query;

    const searchFilter = query
      ? {
          $or: [
            { studentName: { $regex: query, $options: 'i' } },
            { rollNumber: { $regex: query, $options: 'i' } },
          ],
        }
      : {};

    const reportCards = await ReportCard.find(searchFilter).sort({ createdAt: -1 });
    res.json(reportCards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report cards', error: error.message });
  }
};

export const getReportCardById = async (req, res) => {
  try {
    const reportCard = await ReportCard.findById(req.params.id);

    if (!reportCard) {
      return res.status(404).json({ message: 'Report card not found' });
    }

    return res.json(reportCard);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch report card', error: error.message });
  }
};
