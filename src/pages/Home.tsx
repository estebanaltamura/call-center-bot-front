// ** React
import { useEffect, useState } from 'react';

// ** Components
import ChatTab from 'views/chatsViewerTab/ChatTab';
import BussinesTab from 'views/bussinesTab/BussinesTab';
import AssistantTab from 'views/assistantTab/AssistantTab';
import RulesTab from 'views/rules/RulesTab';
import KnowledgeTab from 'views/knowledgeTab/KnowledgeTab';
import SettingsTab from 'views/settingsTab/SettingsTab';
import Loader from 'components/general/Loader';

// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';
import { useLoadingContext } from 'contexts/LoadingProvider';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useRulesContext } from 'contexts/RulesProvider';
import { useKnowledgeContextContext } from 'contexts/KnoledgeProvider';

const Home = () => {
  // States
  const [activeTab, setActiveTab] = useState('chats');

  // Contexts
  const { setMode: setCompanyMode } = useCompanyContext();
  const { setMode: setAssistantMode } = useAssistantContext();
  const { setMode: setRulesMode } = useRulesContext();
  const { setMode: setKnowledgeMode } = useKnowledgeContextContext();
  const { isLoading } = useLoadingContext();

  // Función para renderizar el contenido según la tab activa
  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatTab />;
      case 'bussines':
        return <BussinesTab />;
      case 'assistant':
        return <AssistantTab />;
      case 'rules':
        return <RulesTab />;
      case 'rules':
        return <KnowledgeTab />;
      case 'settings':
        return <SettingsTab />;
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
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'chats' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab('bussines')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'bussines' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Negocio
        </button>
        <button
          onClick={() => setActiveTab('assistant')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'assistant' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Asistente
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'knowledge' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Conocimiento
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
      </div>

      {/* Contenido */}
      {isLoading ? <Loader /> : <div className="flex-1 overflow-auto p-4">{renderContent()}</div>}
    </div>
  );
};

export default Home;
