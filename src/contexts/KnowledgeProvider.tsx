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

interface SystemContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  currentKnowledge: IKnowledgeEntity | null;
  setCurrentKnowledge: React.Dispatch<React.SetStateAction<IKnowledgeEntity | null>>;

  allKnowledgeList: IKnowledgeEntity[];
  setKnowledgeList: React.Dispatch<React.SetStateAction<IKnowledgeEntity[]>>;

  knowledgeToEdit: IKnowledgeEntity | null;
  setKnowledgeToEdit: React.Dispatch<React.SetStateAction<IKnowledgeEntity | null>>;

  tempKnowledgeData: IOptionTextItem[];
  setTempKnowledgeData: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

const KnowledgeContext = createContext<SystemContextType | undefined>(undefined);

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
  const [currentKnowledge, setCurrentKnowledge] = useState<IKnowledgeEntity | null>(null);
  const [allKnowledgeList, setKnowledgeList] = useState<IKnowledgeEntity[]>([]);
  const [knowledgeToEdit, setKnowledgeToEdit] = useState<IKnowledgeEntity | null>(null);
  const [tempKnowledgeData, setTempKnowledgeData] = useState<IOptionTextItem[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.knowledge, 'id', '==', docId);

      if (!res) return;

      setKnowledgeToEdit({
        ...res,
      });

      // Setea los bullets del systemPrompt puntual que se quiere modificar
      // Setea el modo de la tab systemPrompt en edit. Oculta el componente con el listado de systemPrompts y muestra el componente para editar un systemPrompt puntual
      setTempKnowledgeData(res.features);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      alert('Error al cargar documento');
    }
  };

  const handleSave = async () => {
    if (!knowledgeToEdit) return;

    const payload = {
      title: knowledgeToEdit.title,
      features: tempKnowledgeData,
    };

    try {
      SERVICES.CMS.update(Entities.knowledge, knowledgeToEdit.id, payload);

      setMode('main');
      setTempKnowledgeData([]);
      setKnowledgeToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempKnowledgeData([]);
    setKnowledgeToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del título del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allKnowledgeList && settings?.currentKnowledgeName) {
      const currentKnowledgeData = allKnowledgeList.filter(
        (item) => item.title === settings?.currentKnowledgeName,
      );

      setCurrentKnowledge(currentKnowledgeData[0]);
    }
  }, [settings?.currentKnowledgeName, allKnowledgeList]);

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
      setKnowledgeList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <KnowledgeContext.Provider
      value={{
        mode,
        setMode,
        currentKnowledge,
        setCurrentKnowledge,
        allKnowledgeList,
        setKnowledgeList,
        knowledgeToEdit,
        setKnowledgeToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempKnowledgeData,
        setTempKnowledgeData,
      }}
    >
      {children}
    </KnowledgeContext.Provider>
  );
};

export default KnowledgeProvider;
