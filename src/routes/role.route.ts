import * as express from 'express';
import * as roleController from '../controllers/role.controller';

const router = express.Router();

router.post('/', roleController.createRole);

export default router;