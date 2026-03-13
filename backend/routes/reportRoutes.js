import express from 'express';
import {
  createReportCard,
  getReportCardById,
  getReportCards,
} from '../controllers/reportController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdminAuth);

router.post('/', createReportCard);
router.get('/', getReportCards);
router.get('/:id', getReportCardById);

export default router;
