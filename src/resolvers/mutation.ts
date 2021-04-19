import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../config/constants';
import {
  asignVoteId,
  getCharacter,
  getCharacters,
  getVote,
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
          characters: await getCharacters(db),
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

    async updateVote(_: void, { id, character }, { db }) {
      // Comtrobar que el personaje existe
      const selectCharacter = await getCharacter(db, character);
      if (selectCharacter === null || selectCharacter === undefined) {
        return {
          status: false,
          message: 'El personaje no existe y no puedes actualizar el voto',
          characters: await getCharacters(db),
        };
      }
      // Comprobar que el voto existe
      const selectVote = await getVote(db, id);
      if (selectVote === null || selectVote === undefined) {
        return {
          status: false,
          message: 'El voto no existe y no puedes actualizar',
          characters: await getCharacters(db),
        };
      }
      // Actualizar el voto
      return await db
        .collection(COLLECTIONS.VOTES)
        .updateOne({ id }, { $set: { character } })
        .then(async () => {
          return {
            status: true,
            message: 'Voto actualizado correctamente',
            characters: getCharacters(db),
          };
        })
        .catch(async () => {
          return {
            status: false,
            message:
              'Voto no actualizado correctamente, prueba nuevamente por favor',
            characters: getCharacters(db),
          };
        });
    },

    async deleteVote(_: void, { id }, { db }) {
      // Comprobar que el voto existe
      const selectVote = await getVote(db, id);
      if (selectVote === null || selectVote === undefined) {
        return {
          status: false,
          message: 'El voto no existe y no puedes eliminar',
          characters: await getCharacters(db),
        };
      }
      // Si existe borrarlo
      return await db
        .collection(COLLECTIONS.VOTES)
        .deleteOne({ id })
        .then(async () => {
          return {
            status: true,
            message: 'Voto eliminado correctamente',
            characters: await getCharacters(db),
          };
        })
        .catch(async () => {
          return {
            status: false,
            message: 'Voto no eliminado',
            characters: await getCharacters(db),
          };
        });
    },
  },
};

export default mutation;
