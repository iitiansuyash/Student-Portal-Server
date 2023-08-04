import * as express from 'express';
import * as placementCycleEligibleController from '../controllers/placementCycleEligible.controller';
import { isAuthorized, } from '../middleware/isAuthorized';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';



const router = express.Router();


/*
    ! Admin access - Need to be checked for "isAuthorized"
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/

router.get('/:pcId', isAuthorized, isAdminMiddleware, placementCycleEligibleController.fetchEligibleStudents);
router.post('/:pcId', isAuthorized, isAdminMiddleware, placementCycleEligibleController.createEligibleStudents);
router.get('/checkeligibility/:pcId', isAuthorized, placementCycleEligibleController.checkEligibility);
router.delete('/revokeeligibility', isAuthorized, isAdminMiddleware, placementCycleEligibleController.revokeEligibility);

export default router;