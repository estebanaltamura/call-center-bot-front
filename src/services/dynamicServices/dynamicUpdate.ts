// ** Firebase | Firestore imports
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';

// ** Types imports
import { EntityTypesMapPayloadValues, EntityTypesMapReturnedValues } from 'types/dynamicSevicesTypes';

export const dynamicUpdate = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
  id: string,
  item: Partial<EntityTypesMapPayloadValues[T]>, // Permitir solo una parte del tipo
): Promise<EntityTypesMapReturnedValues[T] | undefined> => {
  const itemDocRef = doc(db, entity, id);

  try {
    const itemRes = await getDoc(itemDocRef);

    if (!itemRes.exists()) {
      throw new Error('Document does not exist');
    }

    const payload = {
      ...item,
      updatedAt: new Date(),
    };

    // Solo actualiza los campos especificados en `item`
    await updateDoc(itemDocRef, payload);

    return {
      id,
      ...itemRes.data(),
      ...payload,
    } as EntityTypesMapReturnedValues[T];
  } catch (error) {
    console.error('Error updating document:', error);
  }
};
