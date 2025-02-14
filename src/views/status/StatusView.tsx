// StatusView.tsx
import { useContext, useEffect, useState } from 'react';

// ** Components
import ConversationCard from 'components/status/ConversationCard';
import ConversationCardDetail from 'components/status/ConversationCardDetail';

// ** Services Imports (no se modifican)

// ** Firestore
import { Timestamp } from 'firebase/firestore';

// ** Types
import { ConversationStatusEnum, Entities, ILead, ISales } from 'types/dynamicSevicesTypes';

// ** Contexts
import ChatHistoryContext from 'contexts/ChatHistoryProvider';
import { SERVICES } from 'services/index';
import { IFilter } from 'services/dynamicServices/dynamicGet';
import UTILS from 'utils';

interface Column {
  name: string;
  items: any[]; // Reemplaza 'any' por el tipo concreto si lo tienes
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
    sales: { name: ConversationStatusEnum.SALES, items: [] },
    noLead: { name: ConversationStatusEnum.NOLEAD, items: [] },
    noEvaluable: { name: ConversationStatusEnum.NOEVALUABLE, items: [] },
  });

  // State para conversación seleccionada
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  useEffect(() => {
    const newColumns: Columns = {
      inProgress: { name: ConversationStatusEnum.INPROGRESS, items: [] },
      lead: { name: ConversationStatusEnum.LEAD, items: [] },
      sales: { name: ConversationStatusEnum.SALES, items: [] },
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
      case ConversationStatusEnum.SALES:
        return 'Sales';
      case ConversationStatusEnum.NOEVALUABLE:
        return 'No evaluable';
      case ConversationStatusEnum.INPROGRESS:
        return 'En progreso';
      default:
        return 'Unknown';
    }
  };

  // Esta función se invoca cuando se cambia el estado de una conversación
  const handleStatusChange = async (newStatus: ConversationStatusEnum) => {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;
    const previousStatus = selectedConversation.status;

    try {
      // Borrado del registro en caso de cambiar de estado de lead  a otro que no sea sales
      if (previousStatus === ConversationStatusEnum.LEAD && newStatus !== ConversationStatusEnum.SALES) {
        const filters: IFilter[] = [
          {
            field: 'conversationId',
            operator: '==',
            value: conversationId,
          },
        ];
        const res = await SERVICES.CMS.get(Entities.leads, filters);
        if (!res || res.length === 0) {
          UTILS.POPUPS.simplePopUp('Documento no encontrado');

          return;
        }

        const docId = res[0].id;

        await SERVICES.CMS.delete(Entities.leads, docId);
      }

      // Creacion del registro si el usuario pasa de inProgress a lead
      if (newStatus === ConversationStatusEnum.LEAD) {
        const conversationFilters: IFilter[] = [
          {
            field: 'id',
            operator: '==',
            value: conversationId,
          },
        ];

        const conversationRes = await SERVICES.CMS.get(Entities.conversations, conversationFilters);

        if (!conversationRes || conversationRes.length === 0) {
          UTILS.POPUPS.simplePopUp('Documento no encontrado');

          return;
        }

        const conversation = conversationRes[0];

        const messagesFilters: IFilter[] = [
          {
            field: 'conversationId',
            operator: '==',
            value: conversationId,
          },
        ];

        const messagesRes = await SERVICES.CMS.get(Entities.messages, messagesFilters);

        if (!messagesRes || messagesRes.length === 0) {
          UTILS.POPUPS.simplePopUp('Documento no encontrado');

          return;
        }

        const messages = messagesRes;

        const activityDaysQuantity = Array.from(
          new Set(
            messages.map((message) => {
              const date = new Date(message.createdAt.seconds * 1000);
              return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            }),
          ),
        ).map((timestamp) => new Date(timestamp));

        const payload: ILead = {
          conversationId,
          startDate: conversation.createdAt,
          conversionDate: Timestamp.now(),
          messageQuantity: messages.length,
          activityDaysQuantity: activityDaysQuantity.length,
        };

        await SERVICES.CMS.create(Entities.leads, payload);
      }

      // Creacion del registro si el usuario pasa de lead a sales
      if (newStatus === ConversationStatusEnum.SALES) {
        const conversationFilters: IFilter[] = [
          {
            field: 'id',
            operator: '==',
            value: conversationId,
          },
        ];

        const conversationRes = await SERVICES.CMS.get(Entities.conversations, conversationFilters);

        if (!conversationRes || conversationRes.length === 0) {
          UTILS.POPUPS.simplePopUp('Documento no encontrado');

          return;
        }

        const conversation = conversationRes[0];

        const leadFilters: IFilter[] = [
          {
            field: 'conversationId',
            operator: '==',
            value: conversationId,
          },
        ];

        const leadRes = await SERVICES.CMS.get(Entities.leads, leadFilters);

        if (!leadRes || leadRes.length === 0) {
          UTILS.POPUPS.simplePopUp('Documento no encontrado');

          return;
        }

        const lead = leadRes[0];

        const messagesFilters: IFilter[] = [
          {
            field: 'conversationId',
            operator: '==',
            value: conversationId,
          },
        ];

        const messagesRes = await SERVICES.CMS.get(Entities.messages, messagesFilters);

        if (!messagesRes || messagesRes.length === 0) {
          UTILS.POPUPS.simplePopUp('Documento no encontrado');

          return;
        }

        const messages = messagesRes;

        const activityDaysQuantity = Array.from(
          new Set(
            messages.map((message) => {
              const date = new Date(message.createdAt.seconds * 1000);
              return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
            }),
          ),
        ).map((timestamp) => new Date(timestamp));

        const payload: ISales = {
          conversationId,
          startDate: conversation.createdAt,
          conversionDateLead: lead.createdAt,
          messageQuantityLead: lead.messageQuantity,
          activityDaysQuantityLead: lead.activityDaysQuantity,
          conversionDateSales: Timestamp.now(),
          messageQuantitySales: messages.length,
          activityDaysQuantitySales: activityDaysQuantity.length,
          fullRefunded: false,
          partialRefunded: false,
        };

        await SERVICES.CMS.create(Entities.sales, payload);

        await SERVICES.CMS.delete(Entities.leads, lead.id);
      }

      setSelectedConversation(null);
    } catch (error) {
      console.error('Error al actualizar el estado de la conversación:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">ESTADO DE SITUACION</h1>
      <div className="p-4 bg-gray-50 rounded shadow">
        <h2 className="text-center font-semibold mb-4">Conversaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            onStatusChange={handleStatusChange} // Se pasa el callback para cambios de estado
          />
        )}
      </div>
    </div>
  );
};

export default StatusView;
