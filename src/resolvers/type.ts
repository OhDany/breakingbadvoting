import { IResolvers } from 'graphql-tools';
import { getCharacterVotes } from '../lib/database-operation';

const type: IResolvers = {
  Character: {
    votes: async (parent: any, __: any, { db }) => {
      return await getCharacterVotes(db, parent.id);
    },
  },
};

export default type;
