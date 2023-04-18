import * as express from "express";
import { isAuthorized } from "../middleware/isAuthorized";

import * as disciplineController from "../controllers/discipline.controller";
import { isAdminMiddleware } from "../middleware/isAdminMiddleware";

const router = express.Router();

router.get("/", isAuthorized, disciplineController.fetchAllDisciplines);
router.post(
  "/admin",
  isAuthorized,
  isAdminMiddleware,
  disciplineController.createDiscipline
);

export default router;