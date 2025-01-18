// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, ISystemPromptEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IService } from 'types';

interface SystemContextType {
  currentSystemPrompt: ISystemPromptEntity | null;
  setCurrentSystemPrompt: React.Dispatch<React.SetStateAction<ISystemPromptEntity | null>>;
  allSystemPromptList: ISystemPromptEntity[];
  setAllSystemPromptList: React.Dispatch<React.SetStateAction<ISystemPromptEntity[]>>;
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  systemPromptToEdit: ISystemPromptEntity | null;
  setSystemPromptToEdit: React.Dispatch<React.SetStateAction<ISystemPromptEntity | null>>;

  tempBullets: string[];
  setTempBullets: React.Dispatch<React.SetStateAction<string[]>>;
  tempServices: IService[];
  setTempServices: React.Dispatch<React.SetStateAction<IService[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  addBullet: (option: string, text: string) => void;
  moveUpBullets: (index: number) => void;
  moveDownBullets: (index: number) => void;
  handleSave: (servicesOrderIndex: number) => Promise<void>;
  handleCancel: () => void;
  updatePrompt: (index: number, value: string) => void;

  addService: (service: IService) => void;
  moveUpServices: (index: number) => void;
  moveDownServices: (index: number) => void;
  deleteBullet: (index: number) => void;
  deleteService: (index: number) => void;
}

const SystemPromptsContext = createContext<SystemContextType | undefined>(undefined);

export const useSystemPromptContext = () => {
  const context = useContext(SystemPromptsContext);
  if (!context) {
    throw new Error('useSystemContext debe usarse dentro de un SystemPromptProvider');
  }
  return context;
};

export const SystemPromptsProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useContext(SettingsContext);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState<ISystemPromptEntity | null>(null);
  const [allSystemPromptList, setAllSystemPromptList] = useState<ISystemPromptEntity[]>([]);
  const [mode, setMode] = useState<'main' | 'edit'>('main');

  const [systemPromptToEdit, setSystemPromptToEdit] = useState<ISystemPromptEntity | null>(null);

  const [tempBullets, setTempBullets] = useState<string[]>([]);
  const [tempServices, setTempServices] = useState<IService[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.systemPrompts, 'id', '==', docId);

      if (!res) return;

      setSystemPromptToEdit({
        ...res,
      });

      // Setea los bullets del systemPrompt puntual que se quiere modificar
      // Setea el modo de la tab systemPrompt en edit. Oculta el componente con el listado de systemPrompts y muestra el componente para editar un systemPrompt puntual
      setTempServices(res.services);
      setTempBullets(res.bullets);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      alert('Error al cargar documento');
    }
  };

  const addBullet = (option: string, text: string) => {
    const newItem = ' ' + option + ' ' + text;
    setTempBullets([...tempBullets, newItem]);
  };

  function updatePrompt(index: number, newValue: string) {
    const updated = [...tempBullets];
    updated[index] = newValue;
    setTempBullets(updated);
  }

  const deleteBullet = (index: number) => {
    const updated = [...tempBullets];
    updated.splice(index, 1);
    setTempBullets(updated);
  };

  const deleteService = (index: number) => {
    const updated = [...tempServices];
    updated.splice(index, 1);
    setTempServices(updated);
  };

  const moveUpBullets = (index: number) => {
    console.log(index);
    if (index === 0) return;
    const updated = [...tempBullets];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempBullets(updated);
  };

  const moveDownBullets = (index: number) => {
    if (index === tempBullets.length - 1) return;
    const updated = [...tempBullets];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempBullets(updated);
  };

  const addService = (service: IService) => {
    setTempServices((prev) => [...prev, service]);
  };

  /**
   * Mueve hacia arriba el servicio en el array tempServices.
   */
  const moveUpServices = (index: number) => {
    if (index === 0) return;
    const updated = [...tempServices];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempServices(updated);
  };

  /**
   * Mueve hacia abajo el servicio en el array tempServices.
   */
  const moveDownServices = (index: number) => {
    if (index === tempServices.length - 1) return;
    const updated = [...tempServices];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempServices(updated);
  };

  const handleSave = async (servicesOrderIndex: number) => {
    if (!systemPromptToEdit) return;

    const payload = {
      title: systemPromptToEdit.title,
      bullets: tempBullets,
      services: tempServices,
      servicesOrderIndex,
      prompt:
        tempBullets.join(' ') +
        ' Servicios prestados: ' +
        tempServices.map((item) => item.fullChain).join(' '),
    };

    try {
      SERVICES.CMS.update(Entities.systemPrompts, systemPromptToEdit.id, payload);

      alert('Documento guardado correctamente');
      setMode('main');
      setSystemPromptToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setSystemPromptToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del titulo del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allSystemPromptList && settings?.currentPromptTitle) {
      const currentSystemPromptData = allSystemPromptList.filter(
        (item) => item.title === settings?.currentPromptTitle,
      );

      setCurrentSystemPrompt(currentSystemPromptData[0]);
    }
  }, [settings?.currentPromptTitle, allSystemPromptList]);

  // Se cargan todos los systemPropmpts
  useEffect(() => {
    const colRef = collection(db, 'systemPrompts');
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: ISystemPromptEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as ISystemPromptEntity;
        data.push({
          ...docData,
        });
      });
      setAllSystemPromptList(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('BULLETS', tempBullets, 'SERVICES', tempServices);
  }, [tempBullets, tempServices]);

  return (
    <SystemPromptsContext.Provider
      value={{
        currentSystemPrompt,
        setCurrentSystemPrompt,
        allSystemPromptList,
        setAllSystemPromptList,
        mode,
        setMode,
        systemPromptToEdit,
        setSystemPromptToEdit,

        tempBullets,
        setTempBullets,

        handleModifyDoc,
        addBullet,
        moveUpBullets,
        moveDownBullets,
        handleSave,
        handleCancel,
        deleteBullet,
        updatePrompt,
        tempServices,
        setTempServices,
        addService,
        moveUpServices,
        moveDownServices,
        deleteService,
      }}
    >
      {children}
    </SystemPromptsContext.Provider>
  );
};

export default SystemPromptsProvider;
