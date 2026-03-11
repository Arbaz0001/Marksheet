<<<<<<< HEAD
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
=======
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
>>>>>>> ed0cc00c47b55670134b48d0f5650fb644776df4
