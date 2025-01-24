import ChatHistoryContext, { ChatHistoryProvider } from 'contexts/ChatHistoryProvider';
import { useContext, useEffect, useState } from 'react';
import ChatDetail from '../../components/chatTab/ChatDetail';
import SideBar from '../../components/chatTab/SideBar';

const ChatTab = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <ChatHistoryProvider>
      <div className="flex border border-gray-300 rounded-t-lg bg-white shadow-lg w-full h-[700px] overflow-hidden z-50 m-auto">
        <SideBar activeChat={activeChat} setActiveChat={setActiveChat} />
        <ChatDetail conversationId={activeChat} />
      </div>
    </ChatHistoryProvider>
  );
};

export default ChatTab;
