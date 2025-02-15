// ** Firestore Imports
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

// Type imports
import { EntityTypesMapReturnedValues, StateTypes } from 'types/dynamicSevicesTypes';

// ** Db Import **
import { db } from 'firebaseConfig';

export const dynamicHardDelete = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
  id: string,
): Promise<EntityTypesMapReturnedValues[T] | undefined> => {
  const docReference = doc(db, entity, id);

  try {
    const item = await getDoc(docReference);

    if (!item.exists()) {
      throw new Error('Document does not exist');
    }

    await updateDoc(docReference, { state: StateTypes.inactive, deletedAt: serverTimestamp() });

    const itemData = item.data();

    return itemData as EntityTypesMapReturnedValues[T];
  } catch (error) {
    console.log('Error trying to delete item', error);
  }
};
