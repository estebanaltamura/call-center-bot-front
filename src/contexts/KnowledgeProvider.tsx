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

interface KnowledgeContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  currentItem: IKnowledgeEntity | null;
  setCurrentItem: React.Dispatch<React.SetStateAction<IKnowledgeEntity | null>>;

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
  const [currentItem, setCurrentItem] = useState<IKnowledgeEntity | null>(null);
  const [allItemList, setAllItemList] = useState<IKnowledgeEntity[]>([]);
  const [itemToEdit, setItemToEdit] = useState<IKnowledgeEntity | null>(null);
  const [tempBullets, setTempBullets] = useState<IOptionTextItem[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.knowledge, 'id', '==', docId);

      if (!res) return;

      setItemToEdit({
        ...res,
      });

      setTempBullets(res.features);
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

  // Cuando cargo todos los system prompts y cargo el string del título del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allItemList && settings?.currentKnowledgeName) {
      const currentKnowledgeData = allItemList.filter(
        (item) => item.title === settings?.currentKnowledgeName,
      );

      setCurrentItem(currentKnowledgeData[0]);
    }
  }, [settings?.currentKnowledgeName, allItemList]);

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
        currentItem,
        setCurrentItem,
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
