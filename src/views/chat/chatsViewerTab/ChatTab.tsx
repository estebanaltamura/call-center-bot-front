import ChatHistoryContext, { ChatHistoryProvider } from 'contexts/ChatHistoryProvider';
import { useContext, useEffect, useState } from 'react';
import ChatDetail from '../../../components/chat/chatTab/ChatDetail';
import SideBar from '../../../components/chat/chatTab/SideBar';

const ChatTab = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <div className="flex border border-gray-300 rounded bg-white shadow-lg w-full min-w-full h-full overflow-hidden z-50 m-auto">
      <SideBar activeChat={activeChat} setActiveChat={setActiveChat} />
      <ChatDetail conversationId={activeChat} />
    </div>
  );
};

export default ChatTab;
