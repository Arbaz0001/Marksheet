import express from 'express';
import {
	createSchool,
	deleteSchool,
	getSchoolById,
	getSchools,
	updateSchool,
} from '../controllers/schoolController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAdminAuth);

router.post('/', createSchool);
router.get('/', getSchools);
router.get('/:id', getSchoolById);
router.put('/:id', updateSchool);
router.delete('/:id', deleteSchool);

export default router;
