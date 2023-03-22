import * as express from 'express';
import * as companyController from '../controllers/company.controller';
import { isAdminMiddleware } from '../middleware/isAdminMiddleware';
import { isAuthorized } from '../middleware/isAuthorized';

const router = express.Router();


/*
    ! Student access - Need to be checked for "isAuthorized"
    ! Admin access - Need to be checked for "isAuthorized" and "isAdminMiddleware"
*/
router.get('/admin/all', isAuthorized, isAdminMiddleware, companyController.fetchAllCompanies);
router.get('/admin/:placementCycleId', isAuthorized, isAdminMiddleware, companyController.fetchCompaniesForCycle);
router.get('/search/:placementCycleId/:query', isAuthorized, companyController.searchCompany);
router.get('/:companyId', isAuthorized, companyController.fetchCompanyById);
router.get('/admin/hrs/:companyId', isAuthorized, isAdminMiddleware, companyController.fetchCompanyHRs);
router.get('/admin/nfs/:companyId', isAuthorized, isAdminMiddleware, companyController.fetchCompanyNFs);

export default router;