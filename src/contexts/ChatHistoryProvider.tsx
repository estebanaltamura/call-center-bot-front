import React, { createContext, useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { IMessage } from 'types';
import { IConversations, IConversationsEntity, IMessageEntity } from 'types/dynamicSevicesTypes';

interface CombinedConversation extends IConversationsEntity {
  messages: IMessageEntity[];
}

const ChatHistoryContext = createContext<CombinedConversation[]>([]);

const ChatHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<IConversationsEntity[]>([]);
  const [messages, setMessages] = useState<IMessageEntity[]>([]);

  useEffect(() => {
    const unsubscribeConversations = onSnapshot(
      collection(db, 'conversations'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const convs = snapshot.docs.map((doc) => {
          return doc.data() as IConversationsEntity;
        });
        setConversations(convs);
      },
    );

    const unsubscribeMessages = onSnapshot(
      collection(db, 'messages'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const msgs = snapshot.docs.map((doc) => {
          return doc.data() as IMessageEntity;
        });
        setMessages(msgs);
      },
    );

    return () => {
      unsubscribeConversations();
      unsubscribeMessages();
    };
  }, []);

  const combinedData = useMemo(() => {
    // Unimos cada conversation con sus mensajes.
    const merged = conversations.map((conversation) => {
      const filteredMessages = messages
        .filter((msg) => msg.conversationId === conversation.phoneNumber)
        .sort((a, b) => {
          if (a.createdAt.seconds === b.createdAt.seconds) {
            return b.createdAt.nanoseconds - a.createdAt.nanoseconds;
          }
          return b.createdAt.seconds - a.createdAt.seconds;
        });
      return { ...conversation, messages: filteredMessages };
    });

    // Ordenamos el array resultante por el mensaje más reciente de cada conversación.
    merged.sort((a, b) => {
      const aRecentMessage = a.messages[0];
      const bRecentMessage = b.messages[0];

      if (aRecentMessage && bRecentMessage) {
        if (aRecentMessage.createdAt.seconds === bRecentMessage.createdAt.seconds) {
          return bRecentMessage.createdAt.nanoseconds - aRecentMessage.createdAt.nanoseconds;
        }
        return bRecentMessage.createdAt.seconds - aRecentMessage.createdAt.seconds;
      } else if (aRecentMessage) {
        return -1;
      } else if (bRecentMessage) {
        return 1;
      }
      return 0;
    });

    return merged;
  }, [conversations, messages]);

  return <ChatHistoryContext.Provider value={combinedData}>{children}</ChatHistoryContext.Provider>;
};

export default ChatHistoryContext;
export { ChatHistoryProvider };
