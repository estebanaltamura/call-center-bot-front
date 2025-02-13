// ** Firestore Imports
import { deleteDoc, doc } from 'firebase/firestore';

// Type imports
import { EntityTypesMapReturnedValues } from 'types/dynamicSevicesTypes';

// ** Db Import **
import { db } from 'firebaseConfig';

export const dynamicDelete = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
  id: string,
): Promise<void> => {
  const docReference = doc(db, entity, id);

  try {
    await deleteDoc(docReference);
    console.log('Documento eliminado exitosamente');
  } catch (error) {
    console.log('Error al intentar eliminar el documento', error);
  }
};
