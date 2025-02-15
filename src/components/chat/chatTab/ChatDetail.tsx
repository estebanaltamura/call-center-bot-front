import Loader from 'components/general/Loader';
import ChatHistoryContext from 'contexts/ChatHistoryProvider';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { sendMessage } from 'services/whatspAppServices/sendMessage';
import UTILS from 'utils';

const ChatDetail = ({
  conversationId,
  statusView,
}: {
  conversationId: string | null;
  statusView?: boolean;
}) => {
  const combinedData = useContext(ChatHistoryContext);
  const chatDetailRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState<string>('');

  const sendMessageHandler = async () => {
    if (!conversationId) return;

    setInputText('');

    await sendMessage(conversationId, inputText);
  };

  const conversationIdSelected = conversationId || combinedData[0]?.phoneNumber;

  // Filtramos la conversación correspondiente al `conversationId`
  const selectedConversation = combinedData.find((item) => item.phoneNumber === conversationIdSelected);

  const heightStyle =
    statusView || (!statusView && selectedConversation?.auto) ? 'h-full' : 'h-[calc(100%-60px)]';

  // Ir al fondo cuando cambien los mensajes
  useEffect(() => {
    if (chatDetailRef.current) {
      chatDetailRef.current.scrollTo(0, chatDetailRef.current.scrollHeight);
    }
  }, [selectedConversation?.messages]);

  if (!selectedConversation) return <Loader />;

  return (
    <div
      className={`flex flex-col ${!statusView && 'border'} border-gray-300 bg-white rounded-tr ${
        !statusView && 'shadow-lg'
      }   flex-grow h-full overflow-hidden z-50`}
    >
      {/* Chat Body */}
      <div
        ref={chatDetailRef}
        className={`flex flex-col overflow-y-auto px-4 py-2 ${heightStyle} scroll-custom`}
      >
        {[...selectedConversation.messages].reverse().map((message, index) => {
          const timestampAdapted = UTILS.DATES.timestampToDate(message.createdAt.seconds);

          return (
            <div
              key={index}
              className={`flex flex-col space-y-1 ${
                message.sender === 'company' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`${
                  message.sender === 'company' ? 'bg-indigo-100' : 'bg-gray-200'
                } text-gray-800 rounded-lg px-3 py-2 text-sm max-w-[400px] break-words`}
              >
                {message.message}
              </div>
              {/* Timestamp */}
              <div className="text-xs text-gray-500">{timestampAdapted}</div>
            </div>
          );
        })}
      </div>

      {/* Input y botón */}
      {!statusView && !selectedConversation.auto && (
        <div className="flex items-center px-4 py-2 bg-gray-100 border-t border-gray-300 h-[60px]">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
            onClick={sendMessageHandler}
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatDetail;
