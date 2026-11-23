import { Router } from 'express';
import {
  createAssessment,
  deleteAssessment,
  getAssessmentById,
  listAssessments,
} from '../controllers/assessment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  assessmentIdParamSchema,
  createAssessmentSchema,
} from '../validators/assessment.validator.js';

const router = Router();

router.use(protect);

router.post('/', validateRequest(createAssessmentSchema), createAssessment);
router.get('/', listAssessments);
router.get('/:id', validateRequest({ params: assessmentIdParamSchema }), getAssessmentById);
router.delete('/:id', validateRequest({ params: assessmentIdParamSchema }), deleteAssessment);

export default router;
