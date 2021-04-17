import { IResolvers } from 'graphql-tools';
import { getCharacters } from '../lib/database-operation';

const query: IResolvers = {
  Query: {
    async characters(_: void, __: any, { db }) {
      return await getCharacters(db);
    },
  },
};

export default query;
