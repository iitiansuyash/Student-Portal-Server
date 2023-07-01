import * as express from 'express';
import * as studentController from '../controllers/student.controller';

const router = express.Router();

router.get('/:admno', studentController.findStudentById);

router.post('/', studentController.createStudent);

router.post('/profile', studentController.createStudentProfile);

router.get('/', studentController.fetchAllStudents);

router.post('/bulk', studentController.createBulk);

router.delete('/:admno', studentController.deleteStudent);

export default router;