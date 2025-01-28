// ** Components
import ChatTab from 'views/chat/chatsViewerTab/ChatView';
import Loader from 'components/general/Loader';

// ** Context
import { useLoadingContext } from 'contexts/LoadingProvider';

const ChatPage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <ChatTab />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
