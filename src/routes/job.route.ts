import * as express from 'express';
import * as jobController from '../controllers/job.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();


/*
    ! Admin access - Need to be checked for "isAuthorized"
*/

router.get('/student/all', isAuthorized, jobController.fetchAllJobsForStudent);
router.get('/student/:jobId', isAuthorized, jobController.fetchJobByIdForStudent);
router.get('/student/apply/:jobId', isAuthorized, jobController.applyJobForStudent);

/*
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/
router.get('/admin/:placementCycleId', isAuthorized, isAdminMiddleware, jobController.fetchJobsForAdmin);
router.get('/admin/search/:placementCycleId/:query', isAuthorized, isAdminMiddleware, jobController.searchJobsForAdmin);
router.post('/admin', jobController.createNewJob);
router.put('/admin/:jobId', jobController.updateJob);
router.delete('/admin/:jobId', jobController.deleteJob);
router.get('/admin/:jobId/applicants', jobController.getApplicants);
router.post('/admin/:jobId/shortlist', jobController.shortlistStudent);

export default router;