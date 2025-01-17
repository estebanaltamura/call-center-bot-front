import { SettingsContext } from 'contexts/SettingsProvider';
import { collection, DocumentData, onSnapshot, query } from 'firebase/firestore';
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SERVICES } from 'services/index';
import { Entities, ISystemPromptEntity } from 'types/dynamicSevicesTypes';

export interface IPromptItem {
  option: string;
  text: string;
}

export interface ISystemPromptDoc {
  id: string;
  title: string;
  prompts: string[];
}

// Ejemplo de interfaz para un servicio (puedes ajustarla a tus necesidades)
export interface IServiceItem {
  option: string;
  text: string;
}

export interface IService {
  title: string;
  description: string;
  items: IServiceItem[];
  fullChain: string;
  // items es la "posibilidad de option, text infinitos" que mencionaste
}

export const bulletOptions = [
  {
    label: 'Requerido',
    options: [
      'Rol que debes adoptar:',
      'Descripción de la empresa:',
      'Descripción del producto:',
      'Descripción del servicio:',
      'Qué hacemos:',
      'Qué no hacemos:',
      'Principal objetivo:',
    ],
  },
  {
    label: 'Otros',
    options: [
      'Longitud de las respuestas:',
      'Tolerancia a conversar sobre temas distintos a la tematica del producto/servicio/empresa:',
      'Priorización de la busqueda de objetivos:',
      'Tono de la conversación:',
      'Casos en los que no responderás:',
      'Casos en los que daras información para que el usuario se comunique por mail:',
      'mail al que esos usuarios pueden contactar por los temas relacionados con el punto anterior:',
      'Casos en los que daras información para que el usuario se comunique por otro numero de whatsapp:',
      'mail al que esos usuarios pueden contactar por los temas relacionados con el punto anterior:',
    ],
  },
];

export const serviceOptions = [
  {
    label: 'Requerido',
    options: ['Tiempo de entrega:', 'Metodo de pago:'],
  },
];

interface SystemContextType {
  currentSystemPrompt: ISystemPromptEntity | null;
  setCurrentSystemPrompt: React.Dispatch<React.SetStateAction<ISystemPromptEntity | null>>;
  allSystemPromptList: ISystemPromptEntity[];
  setAllSystemPromptList: React.Dispatch<React.SetStateAction<ISystemPromptEntity[]>>;
  mode: 'general' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'general' | 'edit'>>;

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

const SystemPromptContext = createContext<SystemContextType | undefined>(undefined);

export const useSystemPromptContext = () => {
  const context = useContext(SystemPromptContext);
  if (!context) {
    throw new Error('useSystemContext debe usarse dentro de un SystemPromptProvider');
  }
  return context;
};

export const SystemPromptProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useContext(SettingsContext);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState<ISystemPromptEntity | null>(null);
  const [allSystemPromptList, setAllSystemPromptList] = useState<ISystemPromptEntity[]>([]);
  const [mode, setMode] = useState<'general' | 'edit'>('general');

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

    try {
      SERVICES.CMS.update(Entities.systemPrompts, systemPromptToEdit.id, {
        title: systemPromptToEdit.title,
        bullets: tempBullets,
        services: tempServices,
        servicesOrderIndex,
        prompt:
          tempBullets.join(' ') +
          ' Servicios prestados: ' +
          tempServices.map((item) => item.fullChain).join(' '),
      });

      alert('Documento guardado correctamente');
      setMode('general');
      setSystemPromptToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('general');
    setSystemPromptToEdit(null);
  };

  const fetchCurrentSystemPrompt = async () => {
    if (!settings) return;

    const { currentPrompt } = settings;

    if (!currentPrompt) {
      setCurrentSystemPrompt(null);
      return;
    }

    try {
      const res = await SERVICES.CMS.get(Entities.systemPrompts, 'title', '==', currentPrompt);
      if (!res) return;

      setCurrentSystemPrompt({
        ...res,
      });
    } catch (error) {
      console.error('Error al obtener el documento de systemPrompts:', error);
      setCurrentSystemPrompt(null);
    }
  };

  useEffect(() => {
    fetchCurrentSystemPrompt();
  }, [settings?.currentPrompt]);

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
    <SystemPromptContext.Provider
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
    </SystemPromptContext.Provider>
  );
};

export default SystemPromptProvider;
