import React, { useState, useEffect } from 'react';

// ** Contexts
import { useBusinessContext } from 'contexts/BusinessProvider';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useRulesContext } from 'contexts/RulesProvider';
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, IHatEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

const getTitleFromId = (id: string, list: { id: string; title: string }[]) => {
  if (!id) return 'none';
  const found = list.find((item) => item.id === id);
  return found ? found.title : 'none';
};

const getIdFromTitle = (title: string, list: { id: string; title: string }[]) => {
  if (!title || title === 'none') return '';
  const found = list.find((item) => item.title === title);
  return found ? found.id : '';
};

export default function PromptComponentSelects({ editItem }: { editItem: IHatEntity }) {
  const { allItemList: allItemListBusiness } = useBusinessContext();
  const { allItemList: allItemListAssistant } = useAssistantContext();
  const { allItemList: allItemListRules } = useRulesContext();
  const { allItemList: allItemListKnowledge } = useKnowledgeContext();

  const [itemState, setItemState] = useState<IHatEntity>(editItem);

  useEffect(() => {
    setItemState(editItem);
  }, [editItem]);

  const updateDB = async (field: 'businessId' | 'assistantId' | 'ruleId' | 'knowledgeId', newId: string) => {
    await SERVICES.CMS.update(Entities.hats, itemState.id, { [field]: newId });
    setItemState((prev) => ({ ...prev, [field]: newId }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <span className="font-semibold w-[180px]">Negocio seleccionado:</span>
        {allItemListBusiness.filter((doc) => doc.state === StateTypes.active).length === 0 ? (
          <span className="font-semibold w-[400px]">No hay negocios creados</span>
        ) : (
          <select
            value={getTitleFromId(itemState.businessId, allItemListBusiness)}
            onChange={(e) => {
              const newId = getIdFromTitle(e.target.value, allItemListBusiness);
              updateDB('businessId', newId);
            }}
            className="border rounded px-2 py-1 h-[40px] w-[320px]"
          >
            <option value="none">Ninguno</option>
            {allItemListBusiness
              .filter((doc) => doc.state === StateTypes.active)
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((doc) => (
                <option key={uuidv4()} value={doc.title}>
                  {doc.title}
                </option>
              ))}
          </select>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <span className="font-semibold w-[180px]">Asistente seleccionado:</span>
        {allItemListAssistant.filter((doc) => doc.state === StateTypes.active).length === 0 ? (
          <span className="font-semibold w-[400px]">No hay Asistentes creados</span>
        ) : (
          <select
            value={getTitleFromId(itemState.assistantId, allItemListAssistant)}
            onChange={(e) => {
              const newId = getIdFromTitle(e.target.value, allItemListAssistant);
              updateDB('assistantId', newId);
            }}
            className="border rounded px-2 py-1 h-[40px] w-[320px]"
          >
            <option value="none">Ninguno</option>
            {allItemListAssistant
              .filter((doc) => doc.state === StateTypes.active)
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((doc) => (
                <option key={uuidv4()} value={doc.title}>
                  {doc.title}
                </option>
              ))}
          </select>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <span className="font-semibold w-[180px]">Regla seleccionada:</span>
        {allItemListRules.filter((doc) => doc.state === StateTypes.active).length === 0 ? (
          <span className="font-semibold w-[400px]">No hay reglas creadas</span>
        ) : (
          <select
            value={getTitleFromId(itemState.ruleId, allItemListRules)}
            onChange={(e) => {
              const newId = getIdFromTitle(e.target.value, allItemListRules);
              updateDB('ruleId', newId);
            }}
            className="border rounded px-2 py-1 h-[40px] w-[320px]"
          >
            <option value="none">Ninguno</option>
            {allItemListRules
              .filter((doc) => doc.state === StateTypes.active)
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((doc) => (
                <option key={uuidv4()} value={doc.title}>
                  {doc.title}
                </option>
              ))}
          </select>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <span className="font-semibold w-[180px]">Contexto seleccionado:</span>
        {allItemListKnowledge.filter((doc) => doc.state === StateTypes.active).length === 0 ? (
          <span className="font-semibold w-[400px]">No hay contexto de conocimiento creados</span>
        ) : (
          <select
            value={getTitleFromId(itemState.knowledgeId, allItemListKnowledge)}
            onChange={(e) => {
              const newId = getIdFromTitle(e.target.value, allItemListKnowledge);
              updateDB('knowledgeId', newId);
            }}
            className="border rounded px-2 py-1 h-[40px] w-[320px]"
          >
            <option value="none">Ninguno</option>
            {allItemListKnowledge
              .filter((doc) => doc.state === StateTypes.active)
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((doc) => (
                <option key={uuidv4()} value={doc.title}>
                  {doc.title}
                </option>
              ))}
          </select>
        )}
      </div>
    </div>
  );
}
