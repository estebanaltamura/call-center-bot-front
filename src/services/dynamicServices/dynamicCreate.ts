// ** Firestore Imports **
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

// ** Type Imports **
import {
  EntityTypesMapPayloadValues,
  EntityTypesMapReturnedValues,
  StateTypes,
} from '../../types/dynamicSevicesTypes';

// ** Random id library **
import { v4 as uuidv4 } from 'uuid';

// ** Db Import **
import { db } from 'firebaseConfig';

export const dynamicCreate = async <T extends keyof EntityTypesMapPayloadValues>(
  collection: T,
  item: EntityTypesMapPayloadValues[T],
): Promise<EntityTypesMapReturnedValues[T] | undefined> => {
  const itemId = uuidv4();

  const itemDocRef = doc(db, collection, itemId);

  // Construcción del payload
  const payload: EntityTypesMapReturnedValues[T] = {
    id: itemId,
    ...item,
    softState: StateTypes.active,
    state: StateTypes.active,
    createdAt: serverTimestamp(),
  } as EntityTypesMapReturnedValues[T];

  try {
    await setDoc(itemDocRef, payload);
    return payload;
  } catch (error) {
    console.log(error);
  }
};
