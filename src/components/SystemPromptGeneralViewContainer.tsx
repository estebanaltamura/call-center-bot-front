import { ISystemPromptDoc, useSystemPromptContext } from 'contexts/SystemPromptProvider';
import { SERVICES } from 'services/index';
import SystemPromptGeneralViewItem from './SystemPromptGeneralViewItem';

const SystemPromptGeneralViewContainer = () => {
  const { systemPrompts, newSystemPromptTitle, setNewSystemPromptTitle } = useSystemPromptContext();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">System prompts</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 py-1 w-72"
          placeholder="Nombre del system prompt"
          value={newSystemPromptTitle}
          onChange={(e) => setNewSystemPromptTitle(e.target.value)}
        />
        <button
          onClick={() => {
            SERVICES.PROMPT.createSystemPrompt(newSystemPromptTitle);
            setNewSystemPromptTitle('');
          }}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Crear system prompt
        </button>
      </div>
      {systemPrompts.length === 0 && <p className="text-gray-500">No hay documentos aún.</p>}
      <ul className="space-y-2">
        {systemPrompts.map((docItem: ISystemPromptDoc, index: number) => (
          <SystemPromptGeneralViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    </div>
  );
};

export default SystemPromptGeneralViewContainer;
