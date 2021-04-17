import { IResolvers } from 'graphql-tools';

const type: IResolvers = {
  Character: {
    votes: (parent) => 0,
  },
};

export default type;
