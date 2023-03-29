import * as express from 'express';
import { isAuthorized } from '../middleware/isAuthorized';
import { uploadFile } from '../utils/drive-service';
import * as multer from 'multer';

const router = express.Router();


const storage = multer.diskStorage({});

const upload = multer({ storage });

/*
    ! Admin access - Need to be checked for "isAuthorized"
*/
router.post('/', isAuthorized, upload.single('file'), uploadFile);

/*
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/

export default router;