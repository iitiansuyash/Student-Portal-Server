import * as express from 'express';
import { isAuthorized } from '../middleware/isAuthorized';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import * as acadYearController from '../controllers/acadYear.controller';

const router = express.Router();

router.get('/admin', isAuthorized, isAdminMiddleware, acadYearController.fetchCurrentAcadYear);
router.get('/admin/all', isAuthorized, isAdminMiddleware, acadYearController.fetchAllAcadYears);

export default router;