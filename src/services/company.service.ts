import { Company } from "../entity/Company";
import { Company_Repository } from "../repositories/company.repository";

interface Query {
  companyId?: number;
  companyName?: string,
  companyWebsite?: string,
}

export const findAll = async (): Promise<Company[] | null> => {
  return await Company_Repository.find()
};

export const findByQuery = async (
  query: Query
): Promise<Company[] | null> => {
  return await Company_Repository.find({ where: query })
};

export const fetchCompany = async (
  companyId: number
): Promise<Company | null> => {
  return await Company_Repository.findOneBy({ companyId });
};

export const createCompany = async (company: Company): Promise<Company | null> => {
  return await Company_Repository.save(company);
};

export const update = async (
  companyId: number,
  company: Company
): Promise<Company | null> => {
  await Company_Repository.update({ companyId }, company);
  return await fetchCompany(companyId);
};

export const remove = async (
  companyId: number
): Promise<Company | null> => {
  const company = await Company_Repository.findOneBy({ companyId });

  if (company) await Company_Repository.softDelete(companyId);

  return company;
};
