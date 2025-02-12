// ** React
import { useContext, useEffect, useState } from 'react';

// ** Components
import ConversationCard from 'components/status/ConversationCard';
import ConversationCardDetail from 'components/status/ConversationCardDetail';

// ** Types
import { ConversationStatusEnum } from 'types/dynamicSevicesTypes';

// ** Contexts
import ChatHistoryContext from 'contexts/ChatHistoryProvider';

interface Column {
  name: string;
  items: any[]; // Reemplaza 'any' por el tipo concreto si lo tienes, por ejemplo CombinedConversation
}

interface Columns {
  [key: string]: Column;
}

const StatusView = () => {
  const combinedData = useContext(ChatHistoryContext);

  // States data
  const [columns, setColumns] = useState<Columns>({
    inProgress: { name: ConversationStatusEnum.INPROGRESS, items: [] },
    lead: { name: ConversationStatusEnum.LEAD, items: [] },
    noLead: { name: ConversationStatusEnum.NOLEAD, items: [] },
    noEvaluable: { name: ConversationStatusEnum.NOEVALUABLE, items: [] },
  });

  // States UI
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

  const statusMap = (name: string | undefined) => {
    switch (name) {
      case ConversationStatusEnum.LEAD:
        return 'Lead';
      case ConversationStatusEnum.NOLEAD:
        return 'No lead';
      case ConversationStatusEnum.NOEVALUABLE:
        return 'No evaluable';
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
            <h3 className="text-center font-semibold mb-2">{statusMap(column.name)}</h3>
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
