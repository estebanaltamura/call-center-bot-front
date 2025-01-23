// ** React
import { useEffect, useState } from 'react';

// ** Context

// ** Components
import ChatsViewer from 'views/chatsViewerTab/ChatsViewerTab';
import Settings from 'views/settingsTab/SettingsTab';
import BussinesTab from 'views/bussinesTab/BussinesTab';
import AssistantTab from 'views/assistantTab/Assistant';
import RulesTab from 'views/rules/RulesTab';
import { useCompanyContext } from 'contexts/CompanyProvider';
import KnowledgeContextTab from 'views/knowledgeContextTab/KnowledgeContextTab';
import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useRulesContext } from 'contexts/RulesProvider';
import { useKnowledgeContextContext } from 'contexts/KnoledgeProvider';

const Home = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const { setMode: setCompanyMode } = useCompanyContext();
  const { setMode: setAssistantMode } = useAssistantContext();
  const { setMode: setRulesMode } = useRulesContext();
  const { setMode: setKnowledgeContextMode } = useKnowledgeContextContext();
  const { isLoading } = useLoadingContext();

  // Función para renderizar el contenido según la tab activa
  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatsViewer />;
      case 'bussines':
        return <BussinesTab />;
      case 'assistant':
        return <AssistantTab />;
      case 'rules':
        return <RulesTab />;
      case 'rules':
        return <KnowledgeContextTab />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  useEffect(() => {
    setCompanyMode('main');
    setAssistantMode('main');
    setRulesMode('main');
    setKnowledgeContextMode('main');
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
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'rules' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Reglas
        </button>
        <button
          onClick={() => setActiveTab('knowledgeContext')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'knowledgeContext' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Contexto
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'goals' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Objetivos
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
