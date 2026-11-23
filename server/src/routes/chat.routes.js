import { Router } from 'express';
import { getChatHistory, sendChatMessage } from '../controllers/chat.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  chatAssessmentIdParamSchema,
  sendChatMessageSchema,
} from '../validators/chat.validator.js';

const router = Router();

router.use(protect);

router.post('/', validateRequest(sendChatMessageSchema), sendChatMessage);
router.get(
  '/:assessmentId',
  validateRequest({ params: chatAssessmentIdParamSchema }),
  getChatHistory
);

export default router;
