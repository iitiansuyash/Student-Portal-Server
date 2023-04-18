import * as express from 'express';
import * as specializationController from '../controllers/specialization.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();


/*
    ! Admin access - Need to be checked for "isAuthorized"
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/
router.post('/admin', isAuthorized, isAdminMiddleware, specializationController.fetchSpecializationForCourse);
router.post('/admin/create', isAuthorized, isAdminMiddleware, specializationController.createSpecialization);

export default router;