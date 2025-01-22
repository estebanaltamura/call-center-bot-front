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
import { IOptionTextItem, IService } from 'types';

interface SystemContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  currentAssistant: IAssistantEntity | null;
  setCurrentAssistant: React.Dispatch<React.SetStateAction<IAssistantEntity | null>>;

  allAssistantList: IAssistantEntity[];
  setAssistantList: React.Dispatch<React.SetStateAction<IAssistantEntity[]>>;

  assistantToEdit: IAssistantEntity | null;
  setAssistantToEdit: React.Dispatch<React.SetStateAction<IAssistantEntity | null>>;

  tempAssistantInformation: IOptionTextItem[];
  setTempAssistantInformation: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

const AssistantContext = createContext<SystemContextType | undefined>(undefined);

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
  const [currentAssistant, setCurrentAssistant] = useState<IAssistantEntity | null>(null);
  const [allAssistantList, setAssistantList] = useState<IAssistantEntity[]>([]);
  const [assistantToEdit, setAssistantToEdit] = useState<IAssistantEntity | null>(null);
  const [tempAssistantInformation, setTempAssistantInformation] = useState<IOptionTextItem[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.assistant, 'id', '==', docId);

      if (!res) return;

      setAssistantToEdit({
        ...res,
      });

      // Setea los bullets del systemPrompt puntual que se quiere modificar
      // Setea el modo de la tab systemPrompt en edit. Oculta el componente con el listado de systemPrompts y muestra el componente para editar un systemPrompt puntual
      setTempAssistantInformation(res.features);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      alert('Error al cargar documento');
    }
  };

  const handleSave = async () => {
    if (!assistantToEdit) return;

    const payload = {
      title: assistantToEdit.title,
      features: tempAssistantInformation,
    };

    try {
      SERVICES.CMS.update(Entities.assistant, assistantToEdit.id, payload);

      setMode('main');
      setTempAssistantInformation([]);
      setAssistantToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempAssistantInformation([]);
    setAssistantToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del titulo del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allAssistantList && settings?.currentAssistantName) {
      const currentAssistantData = allAssistantList.filter(
        (item) => item.title === settings?.currentAssistantName,
      );

      console.log(allAssistantList, settings?.currentAssistantName);
      setCurrentAssistant(currentAssistantData[0]);
    }
  }, [settings?.currentAssistantName, allAssistantList]);

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
      setAssistantList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AssistantContext.Provider
      value={{
        mode,
        setMode,
        currentAssistant,
        setCurrentAssistant,
        allAssistantList,
        setAssistantList,
        assistantToEdit,
        setAssistantToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempAssistantInformation,
        setTempAssistantInformation,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export default AssistantProvider;
