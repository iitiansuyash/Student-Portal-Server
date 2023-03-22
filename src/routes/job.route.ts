import * as express from 'express';
import * as jobController from '../controllers/job.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();


/*
    ! Admin access - Need to be checked for "isAuthorized"
*/
router.get('/student/all', isAuthorized, jobController.fetchAllJobsForStudent);

/*
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/
router.get('/admin/:placementCycleId', isAuthorized, isAdminMiddleware, jobController.fetchJobsForAdmin);
router.post('/admin', jobController.createNewJob);
router.put('/admin/:jobId', jobController.updateJob);
router.delete('/admin/:jobId', jobController.deleteJob);

export default router;