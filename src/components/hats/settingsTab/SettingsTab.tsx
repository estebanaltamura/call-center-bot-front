// ** React
import React, { useContext } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';
import { useBusinessContext } from 'contexts/BusinessProvider';
import { useRulesContext } from 'contexts/RulesProvider';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { ISettings, StateTypes } from 'types/dynamicSevicesTypes';

// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

const SettingsTab = () => {
  const settings = useContext(SettingsContext);

  const { currentBussinesName, currentAssistantName, currentRulesName, currentKnowledgeName } =
    settings as ISettings;

  const { allItemList: allItemListBusiness } = useBusinessContext();
  const { allItemList: allItemListAssistant } = useAssistantContext();
  const { allItemList: allItemListRules } = useRulesContext();
  const { allItemList: allItemListKnoledge } = useKnowledgeContext();

  const handleSelectCompany = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    await SERVICES.SETTINGS.updateCurrentBussinesTitle(val === 'none' ? 'none' : val);
  };

  const handleSelectAssistant = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    await SERVICES.SETTINGS.updateCurrentAssistantTitle(val === 'none' ? 'none' : val);
  };

  const handleSelectRules = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    await SERVICES.SETTINGS.updateCurrentRulesTitle(val === 'none' ? 'none' : val);
  };

  const handleSelectKnowledgeContext = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    await SERVICES.SETTINGS.updateCurrentKnowledgeContextTitle(val === 'none' ? 'none' : val);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">CONFIGURACION</h1>

      {/* Negocio */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold flex items-center h-[40px] w-[180px]">Negocio seleccionado:</span>
        {allItemListBusiness.filter((doc) => doc.state === StateTypes.active).length === 0 ? (
          <span className="font-semibold flex items-center h-[40px] w-[400px]">No hay negocios creados</span>
        ) : (
          <select
            value={currentBussinesName || 'none'}
            onChange={handleSelectCompany}
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

      {/* Asistente */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold flex items-center h-[40px] w-[180px]">Asistente seleccionado:</span>
        {allItemListAssistant.filter((doc) => doc.state === StateTypes.active).length === 0 ? (
          <span className="font-semibold flex items-center h-[40px] w-[400px]">
            No hay Asistentes creados
          </span>
        ) : (
          <select
            value={currentAssistantName || 'none'}
            onChange={handleSelectAssistant}
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

      {/* Regla */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold flex items-center h-[40px] w-[180px]">Regla seleccionada:</span>
        {allItemListRules.filter((doc) => doc.state === StateTypes.active).length === 0 ? (
          <span className="font-semibold flex items-center h-[40px] w-[400px]">No hay reglas creadas</span>
        ) : (
          <select
            value={currentRulesName || 'none'}
            onChange={handleSelectRules}
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

      {/* Contexto de conocimiento */}
      <div className="flex items-center space-x-2">
        <span className="font-semibold flex items-center h-[40px] w-[180px]">Contexto seleccionado:</span>
        {allItemListKnoledge.filter((doc) => doc.state === StateTypes.active).length === 0 ? (
          <span className="font-semibold flex items-center h-[40px] w-[400px]">
            No hay contexto de conocimiento creados
          </span>
        ) : (
          <select
            value={currentKnowledgeName || 'none'}
            onChange={handleSelectKnowledgeContext}
            className="border rounded px-2 py-1 h-[40px] w-[320px]"
          >
            <option value="none">Ninguno</option>
            {allItemListKnoledge
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
};

export default SettingsTab;
