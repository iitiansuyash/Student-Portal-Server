import * as express from 'express';
import * as placementCycleController from '../controllers/placementCycle.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();


/*
    ! Admin access - Need to be checked for "isAuthorized"
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/
router.get('/admin', isAuthorized, isAdminMiddleware, placementCycleController.fetchAllPlacementCycles);
router.get('/enrolled', isAuthorized, placementCycleController.fetchEnrolledPlacementCycle);
router.post('/admin', isAuthorized, isAdminMiddleware, placementCycleController.createNewPlacementCycle);
router.get('/admin/:placementCycleId', isAuthorized, isAdminMiddleware, placementCycleController.fetchPlacementCycleById);

export default router;