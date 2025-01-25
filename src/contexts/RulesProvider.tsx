// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, IRulesEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IOptionTextItem } from 'types';

interface SystemContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  currentRules: IRulesEntity | null;
  setCurrentRules: React.Dispatch<React.SetStateAction<IRulesEntity | null>>;

  allRulesList: IRulesEntity[];
  setRulesList: React.Dispatch<React.SetStateAction<IRulesEntity[]>>;

  rulesToEdit: IRulesEntity | null;
  setRulesToEdit: React.Dispatch<React.SetStateAction<IRulesEntity | null>>;

  tempRulesData: IOptionTextItem[];
  setTempRulesData: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

const RulesContext = createContext<SystemContextType | undefined>(undefined);

export const useRulesContext = () => {
  const context = useContext(RulesContext);
  if (!context) {
    throw new Error('useSystemContext debe usarse dentro de un SystemPromptProvider');
  }
  return context;
};

export const RulesProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useContext(SettingsContext);

  // States
  const [mode, setMode] = useState<'main' | 'edit'>('main');
  const [currentRules, setCurrentRules] = useState<IRulesEntity | null>(null);
  const [allRulesList, setRulesList] = useState<IRulesEntity[]>([]);
  const [rulesToEdit, setRulesToEdit] = useState<IRulesEntity | null>(null);
  const [tempRulesData, setTempRulesData] = useState<IOptionTextItem[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.rules, 'id', '==', docId);

      if (!res) return;

      setRulesToEdit({
        ...res,
      });

      // Setea los bullets del systemPrompt puntual que se quiere modificar
      // Setea el modo de la tab systemPrompt en edit. Oculta el componente con el listado de systemPrompts y muestra el componente para editar un systemPrompt puntual
      setTempRulesData(res.features);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      alert('Error al cargar documento');
    }
  };

  const handleSave = async () => {
    if (!rulesToEdit) return;

    const payload = {
      title: rulesToEdit.title,
      features: tempRulesData,
    };

    try {
      SERVICES.CMS.update(Entities.rules, rulesToEdit.id, payload);

      setMode('main');
      setTempRulesData([]);
      setRulesToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempRulesData([]);
    setRulesToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del título del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allRulesList && settings?.currentRulesName) {
      const currentRulesData = allRulesList.filter((item) => item.title === settings?.currentRulesName);

      setCurrentRules(currentRulesData[0]);
    }
  }, [settings?.currentRulesName, allRulesList]);

  // Se cargan todos los systemPropmpts
  useEffect(() => {
    const colRef = collection(db, Entities.rules);
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IRulesEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as IRulesEntity;
        data.push({
          ...docData,
        });
      });
      setRulesList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <RulesContext.Provider
      value={{
        mode,
        setMode,
        currentRules,
        setCurrentRules,
        allRulesList,
        setRulesList,
        rulesToEdit,
        setRulesToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempRulesData,
        setTempRulesData,
      }}
    >
      {children}
    </RulesContext.Provider>
  );
};

export default RulesProvider;
