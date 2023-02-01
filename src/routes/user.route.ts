import * as express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();

router.get('/:userId', userController.findUserById);

router.post('/', userController.createUser);

router.get('/', userController.fetchAllUsers);

router.post('/bulk', userController.createBulk);

router.delete('/:userId', userController.deleteUser);

export default router;