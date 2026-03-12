import express from 'express';
import { createSchool, getSchools, getSchoolById } from '../controllers/schoolController.js';

const router = express.Router();

router.post('/', createSchool);
router.get('/', getSchools);
router.get('/:id', getSchoolById);

export default router;
