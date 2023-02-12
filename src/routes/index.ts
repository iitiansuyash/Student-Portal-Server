import * as express from 'express';
import studentRoutes from './student.route';
import authRoutes from './auth.route';

const router = express.Router();

router.use('/student', studentRoutes);
router.use('/auth', authRoutes);

export default router;