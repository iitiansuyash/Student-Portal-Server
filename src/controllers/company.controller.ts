import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Company } from "../entity/Company";
import { Notification_Form } from "../entity/Notification_Form";
import * as companyService from '../services/company.service';

const createCompanyData = (data) => {
  const company = new Company();

  company.companyName = data.companyName;
  company.companyWebsite = data.companyWebsite;
  company.category = data.category;
  company.sector = data.sector;

  return company;
}

export const fetchAllCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Company[] | void> => {
  try {
    const companies = await AppDataSource.query(`
        SELECT *
        FROM company AS c
        LEFT JOIN companycategories AS CC
          ON CC.categoryId = c.companyCategoryId
        LEFT JOIN companysectors AS CS
          ON CS.sectorId = c.companySectorId
    `);

    res.status(201).json({ success: true, companies });
  } catch (error) {
    return next(error);
  }
};

export const fetchCompaniesForCycle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Company[] | void> => {
  try {
    const { placementCycleId } = req.params;

    const companies = await AppDataSource.query(`
        SELECT *
        FROM company AS c
        LEFT JOIN companycategories AS CC
          ON CC.categoryId = c.companyCategoryId
        LEFT JOIN companysectors AS CS
          ON CS.sectorId = c.companySectorId
        WHERE c.companyId IN (
            SELECT DISTINCT nf.companyID
            FROM notification_form AS nf
            WHERE nf.placementCycleId = ${placementCycleId}
        );`
    );

    res.status(201).json({ success: true, companies });
  } catch (error) {
    return next(error);
  }
};

export const searchCompany = async (req: Request, res: Response, next: NextFunction) : Promise<Company[] | void> => {
    try {
        const { query, placementCycleId } = req.params;
        const companies = await AppDataSource.query(`
          SELECT *
          FROM company AS c
          LEFT JOIN companycategories AS CC
            ON CC.categoryId = c.companyCategoryId
          LEFT JOIN companysectors AS CS
            ON CS.sectorId = c.companySectorId
          WHERE
            (c.companyName LIKE '%${query}%' OR
            c.companyWebsite LIKE '%${query}%' OR
            CC.categoryName LIKE '%${query}%' OR
            CS.sectorName LIKE '%${query}%') AND (
              c.companyId IN (
                SELECT DISTINCT nf.companyID
                FROM notification_form AS nf
                WHERE nf.placementCycleId = ${placementCycleId}
              )
            )
        `);

        res.status(201).json({ success: true, companies });
    } catch (error) {
        return next(error);
    }
}

export const fetchCompanyById = async (req: Request, res: Response, next: NextFunction) : Promise<Company | void> => {
  try {
    const { companyId } = req.params;

    const company = await AppDataSource.query(`
          SELECT *
          FROM company AS c
          LEFT JOIN companycategories AS CC
            ON CC.categoryId = c.companyCategoryId
          LEFT JOIN companysectors AS CS
            ON CS.sectorId = c.companySectorId
          WHERE c.companyId = ${companyId}
        `);

        res.status(201).json({ success: true, company: company?.[0] });
  } catch (error) {
    return next(error);
  }
}

export const fetchCompanyHRs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params;

    const HRs = await AppDataSource.query(`
      SELECT hr.*, hr_emails.emails as emails, hr_phones.phones as phones
      FROM hr_contact AS hr
      LEFT JOIN (
        SELECT hr_contact_emails.hrId as hrId, GROUP_CONCAT(hr_contact_emails.email) as emails
        FROM hr_contact_emails
        GROUP BY hr_contact_emails.hrId
      ) AS hr_emails
        ON hr.hrContactId = hr_emails.hrId
      LEFT JOIN (
        SELECT hr_contact_phones.hrId as hrId, GROUP_CONCAT(hr_contact_phones.phone) as phones
        FROM hr_contact_phones
        GROUP BY hr_contact_phones.hrId
      ) AS hr_phones
        ON hr.hrContactId = hr_phones.hrId
      WHERE hr.hrContactId IN (
        SELECT DISTINCT poc.hrId
        FROM hr_poc_nf AS poc
        LEFT JOIN notification_form AS nf
          ON poc.nfId = nf.nfId
        WHERE nf.companyId = ${companyId}
      )
      GROUP BY hr.hrContactId
    `);
    res.status(201).json({ success: true, HRs });
  } catch (error) {
    return next(error);
  }
}

export const fetchCompanyNFs = async (req: Request, res: Response, next: NextFunction) : Promise<Notification_Form[] | void> => {
  try{
    const { companyId } = req.params;

    const NFs = await AppDataSource.query(`
      SELECT nf.nfId AS applicationid, nf.profile AS designation, pc.placementCycleId AS placementCycleId, pc.placementCycleName as placementCycleName
      FROM notification_form AS nf
      LEFT JOIN placementcycle pc
      ON nf.placementCycleId = pc.placementCycleId
      WHERE nf.companyId = ${companyId}
    `);

    res.status(201).json({ success: true, NFs });
  } catch (error) {
    return next(error);
  }
}

export const createCompany = async ( req: Request, res: Response, next: NextFunction) : Promise<Company | void> => {
  try {
    const company = await companyService.createCompany(createCompanyData(req.body));

    res.status(201).json({ success: true, company });
  } catch (error) {
    return next(error);
  }
}
