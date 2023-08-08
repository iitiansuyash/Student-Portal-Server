import * as express from 'express';
import * as userController from '../controllers/user.controller';
import { isAuthorized } from '../middleware/isAuthorized';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
// import * as studentController from '../controllers/student.controller';

const router = express.Router();

// router.get('/:admno', studentController.findStudentById);

router.post('/',isAuthorized,isAdminMiddleware, userController.createUser);

router.get('/',isAuthorized,isAdminMiddleware, userController.fetchUsers);

router.get('/:userId',isAuthorized,isAdminMiddleware, userController.deleteUser);

router.post('/bulk',isAuthorized,isAdminMiddleware, userController.createBulk);


// router.get('/', studentController.fetchAllStudents);

// router.post('/bulk', studentController.createBulk);

// router.delete('/:admno', studentController.deleteStudent);

export default router;