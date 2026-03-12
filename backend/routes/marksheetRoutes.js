import express from 'express';
import {
  createMarksheet,
  getMarksheets,
  getMarksheetById,
} from '../controllers/marksheetController.js';

const router = express.Router();

router.post('/', createMarksheet);
router.get('/', getMarksheets);
router.get('/:id', getMarksheetById);

export default router;
