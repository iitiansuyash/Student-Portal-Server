import * as express from 'express';
import studentRoutes from './student.route';
import authRoutes from './auth.route';
import jobRoutes from './job.route';
import companyRoutes from './company.route';
import placementCycleRoutes from './placementCycle.route';
import documentRoutes from './document.route';
import categoryRoutes from './category.route';
import specializationRoutes from './specialization.route';
import courseRoutes from './course.route';
import scptRoutes from './scpt.routes';
import hrRoutes from './hr.route';
import selectionStagesRoutes from './selectionStages.route';
import userRoutes from './user.route';
import departmentRoutes from './department.route';
import acadYearRoutes from './acadYear.route';
import disciplineRoutes from './discipline.route';
import noticeRoutes from './notice.route';

const router = express.Router();

router.use('/student', studentRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/company', companyRoutes);
router.use('/placementcycle', placementCycleRoutes);
router.use('/document', documentRoutes);
router.use('/category', categoryRoutes);
router.use('/specialization', specializationRoutes);
router.use('/course', courseRoutes);
router.use('/scpt', scptRoutes);
router.use('/hr', hrRoutes);
router.use('/stage', selectionStagesRoutes);
router.use('/department', departmentRoutes);
router.use('/acadyear', acadYearRoutes);
router.use('/discipline', disciplineRoutes);
router.use('/notice', noticeRoutes);

export default router;