import { GraphQLError } from 'graphql';
import { getCompany } from './db/companies.js';
import { countJobs, createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from './db/jobs.js';

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError('No Company found with id ' + id);
      }
      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError('No Job found with id ' + id);
      }
      return job;
    },
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      // console.log(items)
      const totalCount = await countJobs();
      return { items, totalCount };
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      // if (!user) {
      //   throw unauthorizedError('Missing authentication');
      // }
      return createJob({ companyId: "FjcJCHJALA4i", title, description });
    },

    deleteJob: async (parent, { id }) => {
      // if (!user) {
      //   throw unauthorizedError('Missing authentication');
      // }
      const job = await deleteJob(id, "FjcJCHJALA4i");
      if (!job) {
        throw notFoundError('No Job found with id ' + id);
      }
      return job;
    },

    updateJob: async (parent, { input: { id, title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError('Missing authentication');
      }
      const job = await updateJob({ id, companyId: user.companyId, title, description });
      if (!job) {
        throw notFoundError('No Job found with id ' + id);
      }
      return job;
    },
  },

  Company: {
    jobs: (company=parent) => getJobsByCompany(company.id),
  },

  Job: {
    // company: (job, _args, { companyLoader }) => {
    //   return companyLoader.load(job.companyId);
    // },
    //
    company: (parent, _args) => getCompany(parent.companyId),
    date: (parent) => toIsoDate(parent.createdAt),
  },
};

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  });
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}