import express from 'express';
import {
  createMarksheet,
  getMarksheets,
  getMarksheetById,
} from '../controllers/marksheetController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdminAuth);

router.post('/', createMarksheet);
router.get('/', getMarksheets);
router.get('/:id', getMarksheetById);

export default router;
