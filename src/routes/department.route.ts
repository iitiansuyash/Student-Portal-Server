import * as express from 'express';
import { isAuthorized } from '../middleware/isAuthorized';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import * as departmentController from '../controllers/department.controller';

const router = express.Router();

router.get('/admin', isAuthorized, isAdminMiddleware, departmentController.fetchAllDepartments);

export default router;