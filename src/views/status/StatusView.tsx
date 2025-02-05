// StatusView.tsx
import React, { useContext, useEffect, useState } from 'react';
import ConversationCard from 'components/status/ConversationCard';
import ConversationCardDetail from 'components/status/ConversationCardDetail';
import { ConversationStatusEnum } from 'types/dynamicSevicesTypes';
import ChatHistoryContext from 'contexts/ChatHistoryProvider';

interface Column {
  name: string;
  items: any[]; // Reemplaza 'any' por el tipo concreto si lo tienes, por ejemplo CombinedConversation
}

interface Columns {
  [key: string]: Column;
}

const StatusView = () => {
  // Se obtienen todas las conversaciones (sin filtrar por fecha) del contexto
  const combinedData = useContext(ChatHistoryContext);
  const [columns, setColumns] = useState<Columns>({
    inProgress: { name: ConversationStatusEnum.INPROGRESS, items: [] },
    lead: { name: ConversationStatusEnum.LEAD, items: [] },
    noLead: { name: ConversationStatusEnum.NOLEAD, items: [] },
    noEvaluable: { name: ConversationStatusEnum.NOEVALUABLE, items: [] },
  });
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  useEffect(() => {
    const newColumns: Columns = {
      inProgress: { name: ConversationStatusEnum.INPROGRESS, items: [] },
      lead: { name: ConversationStatusEnum.LEAD, items: [] },
      noLead: { name: ConversationStatusEnum.NOLEAD, items: [] },
      noEvaluable: { name: ConversationStatusEnum.NOEVALUABLE, items: [] },
    };

    combinedData.forEach((conv: any) => {
      if (newColumns[conv.status]) {
        newColumns[conv.status].items.push(conv);
      } else {
        console.warn('Estado desconocido:', conv.status);
      }
    });
    setColumns(newColumns);
  }, [combinedData]);

  const nameMap = (name: string) => {
    switch (name) {
      case ConversationStatusEnum.LEAD:
        return 'Lead';
      case ConversationStatusEnum.NOLEAD:
        return 'No Lead';
      case ConversationStatusEnum.NOEVALUABLE:
        return 'No Evaluable';
      case ConversationStatusEnum.INPROGRESS:
        return 'En progreso';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <h2 className="text-center font-semibold mb-4">Conversaciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(columns).map(([columnKey, column]) => (
          <div key={columnKey} className="bg-white rounded shadow p-2">
            <h3 className="text-center font-semibold mb-2">{nameMap(column.name)}</h3>
            {column.items.length === 0 ? (
              <div className="text-center text-sm text-gray-600">Sin conversaciones</div>
            ) : (
              column.items.map((conversation) => (
                <div
                  key={conversation.id}
                  className="mb-2 cursor-pointer"
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <ConversationCard conversation={conversation} />
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {selectedConversation && (
        <ConversationCardDetail
          conversation={selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
};

export default StatusView;
