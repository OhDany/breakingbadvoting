import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../config/constants';
import {
  asignVoteId,
  getCharacter,
  getCharacters,
} from '../lib/database-operation';
import { Datetime } from '../lib/datetime';

const mutation: IResolvers = {
  Mutation: {
    async addVote(_: void, { character }, { db }) {
      // Comprueba que el personaje existe
      const selectCharacter = await getCharacter(db, character);
      if (selectCharacter === null || selectCharacter === undefined) {
        return {
          status: false,
          message: 'El personaje no existe y no puedes votar',
          character: await getCharacters(db),
        };
      }

      // Obtiene el id del voto
      const vote = {
        id: await asignVoteId(db),
        character,
        createdAt: new Datetime().getCurrentDateTime(),
      };

      return await db
        .collection(COLLECTIONS.VOTES)
        .insertOne(vote)
        .then(async () => {
          return {
            status: true,
            message: 'El personaje existe y se ha votado',
            characters: await getCharacters(db),
          };
        })
        .catch(async () => {
          return {
            status: false,
            message: 'Hay un problema el voto no se ha emitido',
            characters: await getCharacters(db),
          };
        });
    },
  },
};

export default mutation;
