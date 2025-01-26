// ** React
import { useEffect, useState } from 'react';

// ** Components
import BussinesTab from 'views/systemPrompt/bussinesTab/BussinesTab';
import AssistantTab from 'views/systemPrompt/assistantTab/AssistantTab';
import RulesTab from 'views/systemPrompt/rulesTab/RulesTab';
import KnowledgeTab from 'views/systemPrompt/knowledgeTab/KnowledgeTab';
import SettingsTab from 'views/systemPrompt/settingsTab/SettingsTab';
import Loader from 'components/general/Loader';

// ** Context
import { useBusinessContext } from 'contexts/BusinessProvider';
import { useLoadingContext } from 'contexts/LoadingProvider';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useRulesContext } from 'contexts/RulesProvider';
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';
import PromptTab from 'views/systemPrompt/prompTab/PromptTab';

const SystemPromptPage = () => {
  // States
  const [activeTab, setActiveTab] = useState('business');

  // Contexts
  const { setMode: setCompanyMode } = useBusinessContext();
  const { setMode: setAssistantMode } = useAssistantContext();
  const { setMode: setRulesMode } = useRulesContext();
  const { setMode: setKnowledgeMode } = useKnowledgeContext();
  const { isLoading } = useLoadingContext();

  // Función para renderizar el contenido según la tab activa
  const renderContent = () => {
    switch (activeTab) {
      case 'business':
        return <BussinesTab />;
      case 'assistant':
        return <AssistantTab />;
      case 'rules':
        return <RulesTab />;
      case 'knowledge':
        return <KnowledgeTab />;
      case 'settings':
        return <SettingsTab />;
      case 'systemPrompt':
        return <PromptTab />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setCompanyMode('main');
    setAssistantMode('main');
    setRulesMode('main');
    setKnowledgeMode('main');
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 px-4 py-2">
        <button
          onClick={() => setActiveTab('business')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'business' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Negocios
        </button>
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'assistant' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Asistentes
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'knowledge' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Contextos de conocimiento
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'rules' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Reglas
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Configuración
        </button>
        <button
          onClick={() => setActiveTab('systemPrompt')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'systemPrompt' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Prompt
        </button>
      </div>

      {/* Contenido */}
      {isLoading ? <Loader /> : <div className="flex-1 overflow-auto p-4">{renderContent()}</div>}
    </div>
  );
};

export default SystemPromptPage;
