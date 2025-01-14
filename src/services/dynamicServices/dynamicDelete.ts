// ** Firestore Imports
import { deleteDoc, doc, getDoc } from 'firebase/firestore';

// Type imports
import { EntityTypesMapReturnedValues } from 'types/dynamicSevicesTypes';

// ** Db Import **
import { db } from 'firebaseConfig';

export const dynamicDelete = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
  id: string,
): Promise<EntityTypesMapReturnedValues[T] | undefined> => {
  const docReference = doc(db, entity, id);

  try {
    const item = await getDoc(docReference);

    if (!item.exists()) {
      throw new Error('Product does not exist');
    }

    await deleteDoc(docReference);

    const itemData = item.data();

    return itemData as EntityTypesMapReturnedValues[T];
  } catch (error) {
    console.log('Error trying to delete item', error);
  }
};
