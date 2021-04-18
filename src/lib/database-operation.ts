import { COLLECTIONS } from '../config/constants';

// Lista de personajes
export async function getCharacters(db: any) {
  return await db
    .collection(COLLECTIONS.CHARACTERS)
    .find()
    .sort({ id: 1 })
    .toArray();
}

// Personaje seleccionado
export async function getCharacter(db: any, id: string) {
  return await db.collection(COLLECTIONS.CHARACTERS).findOne({ id });
}
