import DataLoader from 'dataloader';
import { connection } from './connection.js';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export function createCompanyLoader() {
  //The id is coming from JOB resolver in resolver.js..
  return new DataLoader(async (ids) => {
    console.log("[companyLoader] id:", ids)
    const companies = await getCompanyTable().select().whereIn('id', ids);
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}