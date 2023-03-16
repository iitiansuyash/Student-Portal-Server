import * as express from 'express';
import * as jobController from '../controllers/job.controller';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();

router.get('/student/alljobs', isAuthorized, jobController.fetchAllJobsForStudent);

export default router;