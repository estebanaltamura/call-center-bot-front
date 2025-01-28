// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, IAssistantEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IOptionTextItem } from 'types';

// ** Utils
import UTILS from 'utils';

interface AssistantContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  allItemList: IAssistantEntity[];
  setAllItemList: React.Dispatch<React.SetStateAction<IAssistantEntity[]>>;

  itemToEdit: IAssistantEntity | null;
  setItemToEdit: React.Dispatch<React.SetStateAction<IAssistantEntity | null>>;

  tempBullets: IOptionTextItem[];
  setTempBullets: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const useAssistantContext = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useSystemContext debe usarse dentro de un SystemPromptProvider');
  }
  return context;
};

export const AssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useContext(SettingsContext);

  // States
  const [mode, setMode] = useState<'main' | 'edit'>('main');
  const [allItemList, setAllItemList] = useState<IAssistantEntity[]>([]);
  const [itemToEdit, setItemToEdit] = useState<IAssistantEntity | null>(null);
  const [tempBullets, setTempBullets] = useState<IOptionTextItem[]>([]);

  const handleModifyDoc = async (docId: string) => {
    console.log('handleModifyDoc', docId);
    try {
      const res = await SERVICES.CMS.get(Entities.assistant, 'id', '==', docId);

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
      SERVICES.CMS.update(Entities.assistant, itemToEdit.id, payload);

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
    const colRef = collection(db, Entities.assistant);
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IAssistantEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as IAssistantEntity;
        data.push({
          ...docData,
        });
      });
      setAllItemList(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('tempAssistantData', tempBullets);
  }, [tempBullets]);

  return (
    <AssistantContext.Provider
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
    </AssistantContext.Provider>
  );
};

export default AssistantProvider;
