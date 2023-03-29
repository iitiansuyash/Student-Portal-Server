import * as express from 'express';
import * as scptController from '../controllers/scpt.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();


/*
    ! Admin access - Need to be checked for "isAuthorized"
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/
router.get('/admin', isAuthorized, isAdminMiddleware, scptController.fetchAllScpts);

export default router;