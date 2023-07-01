import * as express from "express";
import { isAuthorized } from '../middleware/isAuthorized';

import * as noticeController from '../controllers/notices.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';

const router = express.Router();

router.post('/', noticeController.fetchNoticesForCycles);
router.post('/admin/:placementCycleId', isAuthorized, isAdminMiddleware, noticeController.createNotice);
router.put('/admin/:noticeId', isAuthorized, isAdminMiddleware, noticeController.updateNotice);
router.delete('/admin/:noticeId', isAuthorized, isAdminMiddleware, noticeController.deleteNotice);

export default router;