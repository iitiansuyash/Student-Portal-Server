import * as express from 'express';
import * as userController from '../controllers/user.controller';
// import * as studentController from '../controllers/student.controller';

const router = express.Router();

// router.get('/:admno', studentController.findStudentById);

router.post('/', userController.createUser);

// router.get('/', studentController.fetchAllStudents);

// router.post('/bulk', studentController.createBulk);

// router.delete('/:admno', studentController.deleteStudent);

export default router;