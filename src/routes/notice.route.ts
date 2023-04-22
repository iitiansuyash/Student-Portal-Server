import * as express from "express";
import { isAuthorized } from '../middleware/isAuthorized';

import * as noticeController from '../controllers/notices.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';

const router = express.Router();

router.post('/', isAuthorized, noticeController.fetchNoticesForCycles);
router.post('/admin/:placementCycleId', isAuthorized, isAdminMiddleware, noticeController.createNotice);

export default router;