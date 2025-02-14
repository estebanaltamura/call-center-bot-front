import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import ChatHistoryContext from 'contexts/ChatHistoryProvider';
import React, { useContext } from 'react';
import UTILS from 'utils';

const SideBar = ({
  activeChat,
  setActiveChat,
}: {
  activeChat: string | null;
  setActiveChat: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const combinedData = useContext(ChatHistoryContext);

  if (!combinedData) return null;

  // Función para actualizar el valor de "auto" en Firestore
  const toggleAuto = async (phoneNumber: string, currentAuto: boolean) => {
    try {
      const conversationRef = doc(db, 'conversations', phoneNumber);
      await updateDoc(conversationRef, {
        auto: !currentAuto,
      });
      console.log(`Valor de 'auto' actualizado para ${phoneNumber}`);
    } catch (error) {
      console.error('Error actualizando "auto":', error);
    }
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-tl bg-white shadow-lg w-[250px] min-w-[250px] h-full overflow-hidden z-50">
      <div className="flex flex-col overflow-y-auto">
        {combinedData &&
          combinedData.length > 0 &&
          combinedData.map((conversation, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-300 py-2 px-4 cursor-pointer"
                onClick={() => {
                  setActiveChat(conversation.phoneNumber);
                }}
                style={{
                  backgroundColor: activeChat === conversation.phoneNumber ? 'cyan' : 'white',
                }}
              >
                {/* Izquierda: Teléfono y Fecha */}
                <div className="flex flex-col">
                  <div className="text-gray-800 text-sm">{conversation.phoneNumber}</div>
                  <div className="text-xs text-gray-500">
                    {UTILS.DATES.timestampToDate(conversation.messages[0]?.createdAt.seconds)}
                  </div>
                </div>

                {/* Derecha: AUTO */}
                <div
                  className={`text-sm font-bold ${
                    conversation.auto ? 'text-green-600' : 'text-red-600'
                  } cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita activar el evento de setActiveChat
                    toggleAuto(conversation.phoneNumber, conversation.auto);
                  }}
                >
                  AUTO
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SideBar;
