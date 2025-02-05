// ** Firestore Imports
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

// Type imports
import { EntityTypesMapReturnedValues, StateTypes } from 'types/dynamicSevicesTypes';

// ** Db Import **
import { db } from 'firebaseConfig';

export const dynamicSoftDelete = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
  id: string,
): Promise<EntityTypesMapReturnedValues[T] | undefined> => {
  const docReference = doc(db, entity, id);

  try {
    const item = await getDoc(docReference);

    if (!item.exists()) {
      throw new Error('Document does not exist');
    }

    // Perform soft delete by updating the `state` field to `inactive`
    await updateDoc(docReference, {
      softState: StateTypes.inactive,
      softDeletedAt: serverTimestamp(),
    });

    // Return the updated item data
    const itemData = { ...item.data(), state: 'inactive' };

    return itemData as EntityTypesMapReturnedValues[T];
  } catch (error) {
    console.error('Error trying to soft delete the document:', error);
  }
};
