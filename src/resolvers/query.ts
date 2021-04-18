import { IResolvers } from 'graphql-tools';
import { getCharacter, getCharacters } from '../lib/database-operation';

const query: IResolvers = {
  Query: {
    async characters(_: void, __: any, { db }) {
      return await getCharacters(db);
    },
    async character(_: void, { id }, { db }) {
      return await getCharacter(db, id);
    },
  },
};

export default query;
