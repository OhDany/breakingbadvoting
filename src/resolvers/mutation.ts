import { IResolvers } from 'graphql-tools';
import { COLLECTIONS } from '../config/constants';
import {
  asignVoteId,
  getCharacter,
  getCharacters,
  getVote,
} from '../lib/database-operation';
import { Datetime } from '../lib/datetime';

async function response(status: boolean, message: string, db: any) {
  return {
    status,
    message,
    characters: await getCharacters(db),
  };
}

const mutation: IResolvers = {
  Mutation: {
    async addVote(_: void, { character }, { db }) {
      // Comprueba que el personaje existe
      const selectCharacter = await getCharacter(db, character);
      if (selectCharacter === null || selectCharacter === undefined) {
        return response(false, 'El personaje no existe y no puedes votar', db);
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
          return response(true, 'El personaje existe y se ha votado', db);
        })
        .catch(async () => {
          return response(
            false,
            'Hay un problema el voto no se ha emitido',
            db
          );
        });
    },

    async updateVote(_: void, { id, character }, { db }) {
      // Comtrobar que el personaje existe
      const selectCharacter = await getCharacter(db, character);
      if (selectCharacter === null || selectCharacter === undefined) {
        return response(
          false,
          'El personaje no existe y no puedes actualizar el voto',
          db
        );
      }
      // Comprobar que el voto existe
      const selectVote = await getVote(db, id);
      if (selectVote === null || selectVote === undefined) {
        return response(false, 'El voto no existe y no puedes actualizar', db);
      }
      // Actualizar el voto
      return await db
        .collection(COLLECTIONS.VOTES)
        .updateOne({ id }, { $set: { character } })
        .then(async () => {
          return response(true, 'Voto actualizado correctamente', db);
        })
        .catch(async () => {
          return response(
            false,
            'Voto no actualizado correctamente, prueba nuevamente por favor',
            db
          );
        });
    },

    async deleteVote(_: void, { id }, { db }) {
      // Comprobar que el voto existe
      const selectVote = await getVote(db, id);
      if (selectVote === null || selectVote === undefined) {
        return response(false, 'El voto no existe y no puedes eliminar', db);
      }
      // Si existe borrarlo
      return await db
        .collection(COLLECTIONS.VOTES)
        .deleteOne({ id })
        .then(async () => {
          return response(true, 'Voto eliminado correctamente', db);
        })
        .catch(async () => {
          return response(false, 'Voto no eliminado', db);
        });
    },
  },
};

export default mutation;
