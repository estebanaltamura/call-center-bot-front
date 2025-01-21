// ** React
import React, { useContext } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** Services
import { SERVICES } from 'services/index';
import { ISettings } from 'types/dynamicSevicesTypes';
import { useAssistantContext } from 'contexts/AssistantProvider';

const SettingsTab = () => {
  const settings = useContext(SettingsContext);

  // Titulo del currentPrompt desde el contexto
  const { currentBussinesName } = settings as ISettings;
  // Data de todos los sistemPrompts en db
  const { allBussinesesList } = useCompanyContext();
  const { allAssistantList } = useAssistantContext();

  // Manejador de cambio en el dropdown
  const handleSelectCompany = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrentPromptTitle = e.target.value;
    await SERVICES.SETTINGS.updateCurrentBussinesTitle(selectedCurrentPromptTitle);
  };

  const handleSelectAssistant = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrentPromptTitle = e.target.value;
    await SERVICES.SETTINGS.updateCurrentAssistantTitle(selectedCurrentPromptTitle);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>

      <div className="flex items-center space-x-2">
        <span className="font-semibold">Negocio seleccionado:</span>
        <select
          value={currentBussinesName || 'null'}
          onChange={handleSelectCompany}
          className="border rounded px-2 py-1"
        >
          {/* Opción inicial */}
          <option value="null" disabled>
            Selecciona un negocio
          </option>

          {allBussinesesList.map((doc) => (
            <option
              key={doc.title}
              value={doc.title}
              className={currentBussinesName === doc.title ? 'text-blue-500 font-bold' : ''}
            >
              {doc.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="font-semibold">Asistente seleccionado:</span>
        <select
          value={currentBussinesName || 'null'}
          onChange={handleSelectAssistant}
          className="border rounded px-2 py-1"
        >
          {/* Opción inicial */}
          <option value="null" disabled>
            Selecciona un negocio
          </option>

          {allAssistantList.map((doc) => (
            <option
              key={doc.title}
              value={doc.title}
              className={currentBussinesName === doc.title ? 'text-blue-500 font-bold' : ''}
            >
              {doc.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SettingsTab;
