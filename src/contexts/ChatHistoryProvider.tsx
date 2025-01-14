import React, { createContext, useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { Conversation, Message } from 'types';
import { db } from 'firebaseConfig';

interface CombinedConversation extends Conversation {
  messages: Message[];
}

const ChatHistoryContext = createContext<CombinedConversation[]>([]);

const ChatHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsubscribeConversations = onSnapshot(
      collection(db, 'conversations'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const convs = snapshot.docs.map((doc) => {
          return doc.data() as Conversation;
        });
        setConversations(convs);
      },
    );

    const unsubscribeMessages = onSnapshot(
      collection(db, 'messages'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const msgs = snapshot.docs.map((doc) => {
          return doc.data() as Message;
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
          if (a.timestamp.seconds === b.timestamp.seconds) {
            return b.timestamp.nanoseconds - a.timestamp.nanoseconds;
          }
          return b.timestamp.seconds - a.timestamp.seconds;
        });
      return { ...conversation, messages: filteredMessages };
    });

    // Ordenamos el array resultante por el mensaje más reciente de cada conversación.
    merged.sort((a, b) => {
      const aRecentMessage = a.messages[0];
      const bRecentMessage = b.messages[0];

      if (aRecentMessage && bRecentMessage) {
        if (aRecentMessage.timestamp.seconds === bRecentMessage.timestamp.seconds) {
          return bRecentMessage.timestamp.nanoseconds - aRecentMessage.timestamp.nanoseconds;
        }
        return bRecentMessage.timestamp.seconds - aRecentMessage.timestamp.seconds;
      } else if (aRecentMessage) {
        return -1;
      } else if (bRecentMessage) {
        return 1;
      }
      return 0;
    });

    return merged;
  }, [conversations, messages]);

  console.log('combinedData', combinedData);

  return <ChatHistoryContext.Provider value={combinedData}>{children}</ChatHistoryContext.Provider>;
};

export default ChatHistoryContext;
export { ChatHistoryProvider };
