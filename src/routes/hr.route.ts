import * as express from 'express';
import * as hrController from '../controllers/hr.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();


/*
    ! Admin access - Need to be checked for "isAuthorized"
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/
router.post('/admin', isAuthorized, isAdminMiddleware, hrController.createHR);

export default router;