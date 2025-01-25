// ** React
import { useState } from 'react';

// ** Components
import ChatTab from 'views/chat/chatsViewerTab/ChatTab';
import Loader from 'components/general/Loader';

// ** Context
import { useLoadingContext } from 'contexts/LoadingProvider';

const ChatPage = () => {
  // States
  const [activeTab, setActiveTab] = useState('chats');

  // Contexts
  const { isLoading } = useLoadingContext();

  // Función para renderizar el contenido según la tab activa
  const renderContent = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatTab />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 px-4 py-2">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'chats' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
          }`}
        >
          Chats
        </button>
      </div>

      {/* Contenido */}
      {isLoading ? <Loader /> : <div className="flex-1 overflow-auto p-4">{renderContent()}</div>}
    </div>
  );
};

export default ChatPage;
