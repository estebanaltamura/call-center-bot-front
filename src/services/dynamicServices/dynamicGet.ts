// ** Firestore | Firebase
import { collection, getDocs, query, where, WhereFilterOp } from 'firebase/firestore';
import { db } from 'firebaseConfig';

// ** Types
import { EntityTypesMapReturnedValues } from 'types/dynamicSevicesTypes';

export interface IFilter {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
}

export const dynamicGet = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
  filters?: IFilter[],
): Promise<EntityTypesMapReturnedValues[T][] | undefined> => {
  const productsCollection = collection(db, entity);

  try {
    let collectionQuery = query(productsCollection);

    if (filters && filters.length > 0) {
      filters.forEach((f) => {
        collectionQuery = query(collectionQuery, where(f.field, f.operator, f.value));
      });
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
