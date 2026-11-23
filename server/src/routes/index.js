import { Router } from 'express';
import assessmentRoutes from './assessment.routes.js';
import authRoutes from './auth.routes.js';
import chatRoutes from './chat.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/chat', chatRoutes);

export default router;
