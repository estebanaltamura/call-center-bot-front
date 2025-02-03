import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { useBusinessContext } from './BusinessProvider';
import { useAssistantContext } from './AssistantProvider';
import { useRulesContext } from './RulesProvider';
import { useKnowledgeContext } from './KnowledgeProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Types
import {
  Entities,
  IAssistantEntity,
  IBusinessEntity,
  IHatEntity,
  IKnowledgeEntity,
  IRulesEntity,
} from 'types/dynamicSevicesTypes';

// ** Services
import { SERVICES } from 'services/index';

interface HatContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;
  allItemList: IHatEntity[];
  setAllItemList: React.Dispatch<React.SetStateAction<IHatEntity[]>>;
  itemToEdit: IHatEntity | null;
  setItemToEdit: React.Dispatch<React.SetStateAction<IHatEntity | null>>;
}

const HatContext = createContext<HatContextType | undefined>(undefined);

export const useHatContext = () => {
  const context = useContext(HatContext);
  if (!context) {
    throw new Error('useHatContext debe usarse dentro de un HatContextProvider');
  }
  return context;
};

export const HatProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'main' | 'edit'>('main');
  const [itemToEdit, setItemToEdit] = useState<IHatEntity | null>(null);
  const [allItemList, setAllItemList] = useState<IHatEntity[]>([]);

  const { allItemList: businessItemList } = useBusinessContext();
  const { allItemList: assistantItemList } = useAssistantContext();
  const { allItemList: rulesItemList } = useRulesContext();
  const { allItemList: knowledgeItemList } = useKnowledgeContext();

  const firstElement = `Esto es un prompt de sistema en el que te paso a describir todo lo relevante. 
Sos un asistente que tiene que entender el negocio y sus servicios, las reglas que funcionan como restricciones 
para el asistente y el conocimiento relevante sobre el sector en el que desenvuelve el negocio y los servicios.`;

  const buildPrompt = (
    business: IBusinessEntity | null,
    assistant: IAssistantEntity | null,
    rules: IRulesEntity | null,
    knowledge: IKnowledgeEntity | null,
  ) => {
    let promptToDb = firstElement;

    if (business?.features?.length) {
      const negocioString = business.features.map((f) => `• ${f.option}: ${f.text}`).join('\n');
      promptToDb += `\n\nNEGOCIO\n${negocioString}`;
    }

    if (business?.services?.length) {
      const serviciosString = business.services
        .map((servicio, idx) => {
          const itemsStr = servicio.items.map((i) => `• ${i.option}: ${i.text}`).join('\n');
          return `Servicio ${idx + 1}:\nNombre: ${servicio.title}:\nDescripcion: ${
            servicio.description
          }:\n${itemsStr}`;
        })
        .join('\n\n');
      promptToDb += `\n\nSERVICIOS\n${serviciosString}`;
    }

    if (assistant?.features?.length) {
      const asistenteString = assistant.features.map((f) => `• ${f.option}: ${f.text}`).join('\n');
      promptToDb += `\n\nASISTENTE\n${asistenteString}`;
    }

    if (rules?.features?.length) {
      const reglasString = rules.features.map((f) => `• ${f.option}: ${f.text}`).join('\n');
      promptToDb += `\n\nREGLAS\n${reglasString}`;
    }

    if (knowledge?.features?.length) {
      const conocimientoString = knowledge.features.map((f) => `• ${f.option}: ${f.text}`).join('\n');
      promptToDb += `\n\nCONOCIMIENTO\n${conocimientoString}`;
    }

    return promptToDb;
  };

  useEffect(() => {
    const colRef = collection(db, Entities.hats);
    const q = query(colRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IHatEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as IHatEntity;
        data.push({ ...docData });
      });
      setAllItemList(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!allItemList.length) return;
    allItemList.forEach((hat) => {
      const business = businessItemList.find((b) => b.id === hat.businessId) || null;
      const assistant = assistantItemList.find((a) => a.id === hat.assistantId) || null;
      const rules = rulesItemList.find((r) => r.id === hat.ruleId) || null;
      const knowledge = knowledgeItemList.find((k) => k.id === hat.knowledgeId) || null;
      const newPrompt = buildPrompt(business, assistant, rules, knowledge);
      if (newPrompt !== hat.prompt) {
        SERVICES.CMS.update(Entities.hats, hat.id, { prompt: newPrompt });
      }
    });
  }, [allItemList, businessItemList, assistantItemList, rulesItemList, knowledgeItemList]);

  return (
    <HatContext.Provider
      value={{
        mode,
        setMode,
        allItemList,
        setAllItemList,
        itemToEdit,
        setItemToEdit,
      }}
    >
      {children}
    </HatContext.Provider>
  );
};

export default HatProvider;
