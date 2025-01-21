// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, IKnowledgeContextEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IOptionTextItem } from 'types';

interface SystemContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  currentKnowledgeContext: IKnowledgeContextEntity | null;
  setCurrentKnowledgeContext: React.Dispatch<React.SetStateAction<IKnowledgeContextEntity | null>>;

  allKnowledgeContextList: IKnowledgeContextEntity[];
  setKnowledgeContextList: React.Dispatch<React.SetStateAction<IKnowledgeContextEntity[]>>;

  KnowledgeContextToEdit: IKnowledgeContextEntity | null;
  setKnowledgeContextToEdit: React.Dispatch<React.SetStateAction<IKnowledgeContextEntity | null>>;

  tempKnowledgeContextInformation: IOptionTextItem[];
  setTempKnowledgeContextInformation: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

const KnowledgeContextContext = createContext<SystemContextType | undefined>(undefined);

export const useKnowledgeContextContext = () => {
  const context = useContext(KnowledgeContextContext);
  if (!context) {
    throw new Error('useKnowledgeContextContext debe usarse dentro de un KnowledgeContextProvider');
  }
  return context;
};

export const KnowledgeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useContext(SettingsContext);

  // States
  const [mode, setMode] = useState<'main' | 'edit'>('main');
  const [currentKnowledgeContext, setCurrentKnowledgeContext] = useState<IKnowledgeContextEntity | null>(
    null,
  );
  const [allKnowledgeContextList, setKnowledgeContextList] = useState<IKnowledgeContextEntity[]>([]);
  const [KnowledgeContextToEdit, setKnowledgeContextToEdit] = useState<IKnowledgeContextEntity | null>(null);
  const [tempKnowledgeContextInformation, setTempKnowledgeContextInformation] = useState<IOptionTextItem[]>(
    [],
  );

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.knowledgeContext, 'id', '==', docId);

      if (!res) return;

      setKnowledgeContextToEdit({
        ...res,
      });

      // Setea los bullets del systemPrompt puntual que se quiere modificar
      // Setea el modo de la tab systemPrompt en edit. Oculta el componente con el listado de systemPrompts y muestra el componente para editar un systemPrompt puntual
      setTempKnowledgeContextInformation(res.features);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      alert('Error al cargar documento');
    }
  };

  const handleSave = async () => {
    if (!KnowledgeContextToEdit) return;

    const payload = {
      title: KnowledgeContextToEdit.title,
      features: tempKnowledgeContextInformation,
    };

    try {
      SERVICES.CMS.update(Entities.knowledgeContext, KnowledgeContextToEdit.id, payload);

      alert('Documento guardado correctamente');
      setMode('main');
      setTempKnowledgeContextInformation([]);
      setKnowledgeContextToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempKnowledgeContextInformation([]);
    setKnowledgeContextToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del titulo del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allKnowledgeContextList && settings?.currentKnowledgeContextName) {
      const currentKnowledgeContextData = allKnowledgeContextList.filter(
        (item) => item.title === settings?.currentKnowledgeContextName,
      );

      console.log(allKnowledgeContextList, settings?.currentKnowledgeContextName);
      setCurrentKnowledgeContext(currentKnowledgeContextData[0]);
    }
  }, [settings?.currentKnowledgeContextName, allKnowledgeContextList]);

  // Se cargan todos los systemPropmpts
  useEffect(() => {
    const colRef = collection(db, Entities.knowledgeContext);
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IKnowledgeContextEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as IKnowledgeContextEntity;
        data.push({
          ...docData,
        });
      });
      setKnowledgeContextList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <KnowledgeContextContext.Provider
      value={{
        mode,
        setMode,
        currentKnowledgeContext,
        setCurrentKnowledgeContext,
        allKnowledgeContextList,
        setKnowledgeContextList,
        KnowledgeContextToEdit,
        setKnowledgeContextToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempKnowledgeContextInformation,
        setTempKnowledgeContextInformation,
      }}
    >
      {children}
    </KnowledgeContextContext.Provider>
  );
};

export default KnowledgeContextProvider;
