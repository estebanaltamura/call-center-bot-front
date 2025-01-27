// ** Firestore Imports **
import { collection, getDocs, query, where, WhereFilterOp } from 'firebase/firestore';

// ** Db Import
import { db } from 'firebaseConfig';

// ** Type Imports **
import { EntityTypesMapReturnedValues } from 'types/dynamicSevicesTypes';

export const dynamicGet = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
  field?: string, // Campo para el filtro
  operator?: WhereFilterOp, // Operador para el filtro
  value?: unknown, // Valor para el filtro
): Promise<EntityTypesMapReturnedValues[T][] | undefined> => {
  const productsCollection = collection(db, entity);

  try {
    let collectionQuery = query(productsCollection);

    // Aplica el filtro where si se proporcionan los argumentos
    if (field && operator && value !== undefined) {
      collectionQuery = query(productsCollection, where(field, operator, value));
    }

    const itemRes = await getDocs(collectionQuery);

    const itemList = itemRes.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    return itemList as unknown as EntityTypesMapReturnedValues[T][];
  } catch (error) {
    console.log('Error al obtener los datos:', error);
  }
};
