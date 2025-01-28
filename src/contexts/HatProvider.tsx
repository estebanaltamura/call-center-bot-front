// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, IAssistantEntity, IHatEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IOptionTextItem } from 'types';

// ** Utils
import UTILS from 'utils';

interface HatContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  allItemList: IHatEntity[];
  setAllItemList: React.Dispatch<React.SetStateAction<IHatEntity[]>>;

  itemToEdit: IHatEntity | null;
  setItemToEdit: React.Dispatch<React.SetStateAction<IHatEntity | null>>;
}

const HatContext = createContext<HatContextType | undefined>(undefined);

export const useHatContext = () => {
  const context = useContext(HatContext);
  if (!context) {
    throw new Error('useHatContext debe usarse dentro de un HatContextProvider');
  }
  return context;
};

export const HatProvider = ({ children }: { children: React.ReactNode }) => {
  // States
  const [mode, setMode] = useState<'main' | 'edit'>('main');
  const [itemToEdit, setItemToEdit] = useState<IHatEntity | null>(null);
  const [allItemList, setAllItemList] = useState<IHatEntity[]>([]);

  // Se cargan todos los systemPropmpts
  useEffect(() => {
    const colRef = collection(db, Entities.hats);
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IHatEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as IHatEntity;
        data.push({
          ...docData,
        });
      });
      setAllItemList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <HatContext.Provider
      value={{
        mode,
        setMode,
        allItemList,
        setAllItemList,
        itemToEdit,
        setItemToEdit,
      }}
    >
      {children}
    </HatContext.Provider>
  );
};

export default HatProvider;
