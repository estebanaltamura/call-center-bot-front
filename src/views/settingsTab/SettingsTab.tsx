// ** React
import React, { useContext } from 'react';

// ** Contexts
import { ISettings, SettingsContext } from 'contexts/SettingsProvider';
import { useSystemPromptContext } from 'contexts/SystemPromptsProvider';

// ** Services
import { SERVICES } from 'services/index';

const SettingsTab = () => {
  const settings = useContext(SettingsContext);

  // Titulo del currentPrompt desde el contexto
  const { currentPromptTitle } = settings as ISettings;
  // Data de todos los sistemPrompts en db
  const { allSystemPromptList } = useSystemPromptContext();

  // Manejador de cambio en el dropdown
  const handleChangePromptTitle = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrentPromptTitle = e.target.value;
    await SERVICES.SETTINGS.updateCurrentPromptTitle(selectedCurrentPromptTitle);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>

      <div className="flex items-center space-x-2">
        <span className="font-semibold">currentPrompt:</span>
        <select
          value={currentPromptTitle || 'null'}
          onChange={handleChangePromptTitle}
          className="border rounded px-2 py-1"
        >
          {/* Opción inicial */}
          <option value="null" disabled>
            Selecciona un prompt
          </option>

          {allSystemPromptList.map((doc) => (
            <option
              key={doc.title}
              value={doc.title}
              className={currentPromptTitle === doc.title ? 'text-blue-500 font-bold' : ''}
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
