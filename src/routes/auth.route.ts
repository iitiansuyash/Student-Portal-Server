import * as express from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/signin', authController.SignIn);

export default router;