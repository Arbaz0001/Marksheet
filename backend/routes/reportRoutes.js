import express from 'express';
import {
  createReportCard,
  getReportCardById,
  getReportCards,
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/', createReportCard);
router.get('/', getReportCards);
router.get('/:id', getReportCardById);

export default router;
