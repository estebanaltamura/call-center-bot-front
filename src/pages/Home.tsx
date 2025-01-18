import React, { useState } from 'react';
import ChatsViewer from 'views/chatsViewerTab/ChatsViewerTab';
import Goals from 'views/goalsTab/GoalsTab'; // Asegúrate de crear este componente
import Settings from 'views/settingsTab/SettingsTab';
import SystemPrompt from 'views/systemPromptTab/SystemPromptTab';

const Home = () => {
  const [activeTab, setActiveTab] = useState('chats');

  // Función para renderizar el contenido según la tab activa
  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatsViewer />;
      case 'prompt':
        return <SystemPrompt />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

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
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'prompt' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          System prompt
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'goals' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Goals
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'settings' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-auto p-4">{renderContent()}</div>
    </div>
  );
};

export default Home;
