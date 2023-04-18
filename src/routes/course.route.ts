import * as express from 'express';
import * as courseController from '../controllers/courses.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();


/*
    ! Admin access - Need to be checked for "isAuthorized"
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/
router.get('/admin', isAuthorized, isAdminMiddleware, courseController.fetchAllCourses);
router.post('/admin', isAuthorized, isAdminMiddleware, courseController.createCourse);

export default router;