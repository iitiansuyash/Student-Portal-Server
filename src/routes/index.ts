import * as express from 'express';
import studentRoutes from './student.route';
import authRoutes from './auth.route';
import jobRoutes from './job.route';
import companyRoutes from './company.route';
import placementCycleRoutes from './placementCycle.route';

const router = express.Router();

router.use('/student', studentRoutes);
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/company', companyRoutes);
router.use('/placementcycle', placementCycleRoutes);

export default router;