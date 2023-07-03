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
router.post('/admin',isAuthorized,isAdminMiddleware, jobController.createNewJob);
router.put('/admin/:jobId',isAuthorized,isAdminMiddleware, jobController.updateJob);
router.delete('/admin/:jobId',isAuthorized,isAdminMiddleware, jobController.deleteJob);
router.get('/admin/:jobId/applicants',isAuthorized,isAdminMiddleware, jobController.getApplicants);
router.post('/admin/:jobId/shortlist',isAuthorized,isAdminMiddleware, jobController.shortlistStudent);

export default router;