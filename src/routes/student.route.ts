import * as express from 'express';
import * as studentController from '../controllers/student.controller';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();

// router.get('/:admno', studentController.findStudentById);

router.post('/', studentController.createStudent);

router.post('/profile',isAuthorized, studentController.createStudentProfile);

router.get('/profile',isAuthorized, studentController.fetchStudentProfile);

router.get('/', studentController.fetchAllStudents);

router.post('/bulk', studentController.createBulk);

router.delete('/:admno', studentController.deleteStudent);

export default router;