import { ISystemPromptDoc, useSystemPromptContext } from 'contexts/SystemPromptProvider';
import { useState } from 'react';
import { SERVICES } from 'services/index';
import { ISystemPromptEntity } from 'types/dynamicSevicesTypes';
import SystemPromptGeneralViewItem from './SystemPromptGeneralViewItem';

const SystemPromptGeneralViewContainer = () => {
  const [title, setTitle] = useState<string>('');
  const { allSystemPromptList } = useSystemPromptContext();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">SYSTEM PROMPTS</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 py-1 w-72"
          placeholder="Nombre del nuevo system prompt"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={() => {
            SERVICES.PROMPT.createSystemPrompt(title);
            setTitle('');
          }}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Crear system prompt
        </button>
      </div>
      {allSystemPromptList.length === 0 && <p className="text-gray-500">No hay documentos aún.</p>}
      <ul className="space-y-2">
        {allSystemPromptList.map((docItem: ISystemPromptEntity, index: number) => (
          <SystemPromptGeneralViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    </div>
  );
};

export default SystemPromptGeneralViewContainer;
