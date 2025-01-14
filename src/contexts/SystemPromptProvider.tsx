import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { SettingsContext } from 'contexts/SettingsProvider';
import { SERVICES } from 'services/index';
import { Entities } from 'types/dynamicSevicesTypes';

export interface IPromptItem {
  option: string;
  text: string;
}

export interface ISystemPromptDoc {
  id: string;
  title: string;
  prompts: string[];
}

export const promptOptions = [
  {
    label: 'Sección 1',
    options: [
      'Tono de la conversación:',
      'Rol que debes adoptar:',
      'Nivel de insistencia permitida:',
      'Descripción de la empresa:',
      'Descripción de nuestros servicios:',
      'Qué hacemos:',
      'Qué no hacemos:',
      'Cómo resolver preguntas frecuentes:',
      'Estrategias para lidiar con objeciones:',
      'Cómo tratar con clientes molestos:',
      'Lenguaje formal o informal:',
      'Horario de atención estándar:',
    ],
  },
  {
    label: 'Sección 2',
    options: [
      'Idiomas en los que puedes responder:',
      'Procedimientos de escalación:',
      'Cómo ofrecer productos adicionales:',
      'Cómo manejar devoluciones y reembolsos:',
      'Instrucciones para derivar al equipo humano:',
      'Cómo identificar necesidades del cliente:',
      'Restricciones que debes respetar:',
      'Casos en los que no responderás:',
      'Qué emociones debes transmitir:',
      'Cómo generar empatía con el cliente:',
      'Guías para responder preguntas complejas:',
      'Estrategias para capturar datos útiles:',
      'Qué tono usar en emergencias:',
    ],
  },
  {
    label: 'Sección 3',
    options: [
      'Ejemplos de frases permitidas:',
      'Palabras que nunca debes usar:',
      'Cómo manejar pausas largas:',
      'Estilo de cierre de la conversación:',
      'Límite máximo de tiempo por respuesta:',
      'Qué hacer si el cliente está enojado:',
      'Cómo responder preguntas fuera de alcance:',
      'Guías para iniciar la conversación:',
      'Cómo preguntar datos personales:',
      'Qué actitud tomar si dudas:',
      'Cómo ofrecer disculpas efectivas:',
      'Cómo incentivar una acción específica:',
      'Qué hacer si no entiendes algo:',
      'Cómo manejar clientes que interrumpen:',
      'Cómo evitar respuestas automáticas repetitivas:',
    ],
  },
  {
    label: 'Sección 4',
    options: [
      'Frases para garantizar claridad:',
      'Cómo ofrecer soluciones alternativas:',
      'Cómo dirigir al cliente a la web:',
      'Qué recursos puedes compartir:',
      'Cómo manejar clientes indecisos:',
      'Nivel de personalización permitido:',
      'Cómo identificar problemas recurrentes:',
      'Qué hacer si el cliente no responde:',
      'Cómo informar de tiempos de espera:',
      'Qué hacer si hay un error técnico:',
    ],
  },
];

interface SystemContextType {
  currentSystemPrompt: ISystemPromptDoc | null;
  setCurrentSystemPrompt: React.Dispatch<React.SetStateAction<ISystemPromptDoc | null>>;
  mode: 'general' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'general' | 'edit'>>;
  systemPrompts: ISystemPromptDoc[];
  setsystemPrompts: React.Dispatch<React.SetStateAction<ISystemPromptDoc[]>>;
  currentEditSystemPromptDoc: ISystemPromptDoc | null;
  setCurrentEditSystemPromptDoc: React.Dispatch<React.SetStateAction<ISystemPromptDoc | null>>;
  newSystemPromptTitle: string;
  setNewSystemPromptTitle: React.Dispatch<React.SetStateAction<string>>;
  tempPrompts: string[];
  setTempPrompts: React.Dispatch<React.SetStateAction<string[]>>;
  newOption: string;
  setNewOption: React.Dispatch<React.SetStateAction<string>>;
  newText: string;
  setNewText: React.Dispatch<React.SetStateAction<string>>;
  handleModifyDoc: (docId: string) => Promise<void>;
  handleAddPromptItem: () => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
  deleteSystemPromptBullet: (index: number) => void;
  updatePrompt: (index: number, value: string) => void;
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
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState<ISystemPromptDoc | null>(null);
  const [mode, setMode] = useState<'general' | 'edit'>('general');
  const [systemPrompts, setsystemPrompts] = useState<ISystemPromptDoc[]>([]);
  const [currentEditSystemPromptDoc, setCurrentEditSystemPromptDoc] = useState<ISystemPromptDoc | null>(null);

  const [newSystemPromptTitle, setNewSystemPromptTitle] = useState('');
  const [tempPrompts, setTempPrompts] = useState<string[]>([]);
  const [newOption, setNewOption] = useState(promptOptions[0].options[0]);
  const [newText, setNewText] = useState('');

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.systemPrompts, 'id', '==', docId);

      console.log(res);

      if (!res) return;

      setCurrentEditSystemPromptDoc({
        id: res.id,
        title: res.title || '',
        prompts: res.prompts || [],
      });

      // Setea los bullets del systemPrompt puntual que se quiere modificar
      // Setea el modo de la tab systemPrompt en edit. Oculta el componente con el listado de systemPrompts y muestra el componente para editar un systemPrompt puntual
      setTempPrompts(res.prompts);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      alert('Error al cargar documento');
    }
  };

  const handleAddPromptItem = () => {
    const newItem = newOption + newText;
    setTempPrompts([...tempPrompts, newItem]);
    setNewOption(promptOptions[0].options[0] || '');
    setNewText('');
  };

  function updatePrompt(index: number, newValue: string) {
    const updated = [...tempPrompts];
    updated[index] = newValue;
    setTempPrompts(updated);
  }

  const deleteSystemPromptBullet = (index: number) => {
    const updated = [...tempPrompts];
    updated.splice(index, 1);
    setTempPrompts(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...tempPrompts];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempPrompts(updated);
  };

  const moveDown = (index: number) => {
    if (index === tempPrompts.length - 1) return;
    const updated = [...tempPrompts];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempPrompts(updated);
  };

  const handleSave = async () => {
    if (!currentEditSystemPromptDoc) return;
    try {
      SERVICES.CMS.update(Entities.systemPrompts, currentEditSystemPromptDoc.id, { prompts: tempPrompts });

      alert('Documento guardado correctamente');
      setMode('general');
      setCurrentEditSystemPromptDoc(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('general');
    setCurrentEditSystemPromptDoc(null);
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
        id: res.id,
        title: res.title || '',
        prompts: res.prompts || [],
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
      const data: ISystemPromptDoc[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as DocumentData;
        data.push({
          id: docSnap.id,
          title: docData.title || '',
          prompts: docData.prompts || [],
        });
      });
      setsystemPrompts(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SystemPromptContext.Provider
      value={{
        currentSystemPrompt,
        setCurrentSystemPrompt,
        mode,
        setMode,
        systemPrompts,
        setsystemPrompts,
        currentEditSystemPromptDoc,
        setCurrentEditSystemPromptDoc,
        newSystemPromptTitle,
        setNewSystemPromptTitle,
        tempPrompts,
        setTempPrompts,
        newOption,
        setNewOption,
        newText,
        setNewText,
        handleModifyDoc,
        handleAddPromptItem,
        moveUp,
        moveDown,
        handleSave,
        handleCancel,
        deleteSystemPromptBullet,
        updatePrompt,
      }}
    >
      {children}
    </SystemPromptContext.Provider>
  );
};

export default SystemPromptProvider;
