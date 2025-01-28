import { useState } from 'react';
import ChatDetail from '../../../components/chat/chatTab/ChatDetail';
import SideBar from '../../../components/chat/chatTab/SideBar';

const ChatView = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <div className="p-4 space-y-4 flex flex-col h-full">
      <h1 className="text-xl font-bold text-center">CHAT</h1>
      <div className="flex border border-gray-300 rounded bg-white shadow-lg flex-1 min-h-0 overflow-hidden">
        <SideBar activeChat={activeChat} setActiveChat={setActiveChat} />
        <ChatDetail conversationId={activeChat} />
      </div>
    </div>
  );
};

export default ChatView;
