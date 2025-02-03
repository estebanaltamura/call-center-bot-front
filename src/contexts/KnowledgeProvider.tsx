// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, IKnowledgeEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IOptionTextItem } from 'types';

// ** Utils
import UTILS from 'utils';
import { IFilter } from 'services/dynamicServices/dynamicGet';

interface KnowledgeContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  allItemList: IKnowledgeEntity[];
  setAllItemList: React.Dispatch<React.SetStateAction<IKnowledgeEntity[]>>;

  itemToEdit: IKnowledgeEntity | null;
  setItemToEdit: React.Dispatch<React.SetStateAction<IKnowledgeEntity | null>>;

  tempBullets: IOptionTextItem[];
  setTempBullets: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

const KnowledgeContext = createContext<KnowledgeContextType | undefined>(undefined);

export const useKnowledgeContext = () => {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error('useSystemContext debe usarse dentro de un SystemPromptProvider');
  }
  return context;
};

export const KnowledgeProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useContext(SettingsContext);

  // States
  const [mode, setMode] = useState<'main' | 'edit'>('main');
  const [allItemList, setAllItemList] = useState<IKnowledgeEntity[]>([]);
  const [itemToEdit, setItemToEdit] = useState<IKnowledgeEntity | null>(null);
  const [tempBullets, setTempBullets] = useState<IOptionTextItem[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const filters: IFilter[] = [{ field: 'id', operator: '==', value: docId }];

      const res = await SERVICES.CMS.get(Entities.knowledge, filters);

      if (!res) return;

      const item = res[0];

      setItemToEdit({
        ...item,
      });

      setTempBullets(item.features);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      UTILS.POPUPS.simplePopUp('Error al cargar documento');
    }
  };

  const handleSave = async () => {
    if (!itemToEdit) return;

    const payload = {
      title: itemToEdit.title,
      features: tempBullets,
    };

    try {
      SERVICES.CMS.update(Entities.knowledge, itemToEdit.id, payload);

      setMode('main');
      setTempBullets([]);
      setItemToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      UTILS.POPUPS.simplePopUp('Ucurrio un error al guardar el documento');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempBullets([]);
    setItemToEdit(null);
  };

  // Se cargan todos los systemPropmpts
  useEffect(() => {
    const colRef = collection(db, Entities.knowledge);
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IKnowledgeEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as IKnowledgeEntity;
        data.push({
          ...docData,
        });
      });
      setAllItemList(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(tempBullets);
  }, [tempBullets]);

  return (
    <KnowledgeContext.Provider
      value={{
        mode,
        setMode,
        allItemList,
        setAllItemList,
        itemToEdit,
        setItemToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempBullets,
        setTempBullets,
      }}
    >
      {children}
    </KnowledgeContext.Provider>
  );
};

export default KnowledgeProvider;
