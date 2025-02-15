// ** React
import { useState, useEffect, useContext } from 'react';

// ** Third Party libraries
import axios from 'axios';

// ** Components
import Typo from 'components/general/Typo';
import ChatDetail from 'components/chat/chatTab/ChatDetail';

// ** Types
import {
  ConversationStatusEnum,
  Entities,
  IConversationsEntity,
  IReview,
  IReviewsEntity,
} from 'types/dynamicSevicesTypes';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';

// ** Utils
import UTILS from 'utils';

// ** Contexts
import ChatHistoryContext from 'contexts/ChatHistoryProvider';
import { IFilter } from 'services/dynamicServices/dynamicGet';

interface ConversationCardDetailProps {
  conversation: IConversationsEntity; // Tipo concreto
  onClose: () => void;
  onStatusChange: (newStatus: ConversationStatusEnum) => Promise<void>;
}

const ConversationCardDetail = ({ conversation, onClose, onStatusChange }: ConversationCardDetailProps) => {
  const combinedData = useContext(ChatHistoryContext);

  // ** States data
  const [reviews, setReviews] = useState<IReviewsEntity[]>([]);
  const [newStatus, setNewStatus] = useState<ConversationStatusEnum>(conversation.status);
  const [summary, setSummary] = useState<string>('');
  const [fullRefunded, setFullRefunded] = useState<boolean>();
  const [partialRefunded, setPartialRefunded] = useState<boolean>();

  // ** States UI
  const [showStateChangePopup, setShowStateChangePopup] = useState<boolean>(false);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const statusMap = (name: string | undefined) => {
    switch (name) {
      case ConversationStatusEnum.LEAD:
        return 'Lead';
      case ConversationStatusEnum.SALES:
        return 'Sales';
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

  // Obtiene el log de revisiones (reviews) para la conversación actual.
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await SERVICES.CMS.get(Entities.reviews, [
          { field: 'conversationId', operator: '==', value: conversation.id },
        ]);
        if (!reviewsData) return;
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error al obtener las reviews', error);
      }
    };
    fetchReviews();
  }, [conversation.id]);

  // Llama al endpoint /summarize para generar el resumen usando la IA
  useEffect(() => {
    const generateSummary = async () => {
      setLoadingSummary(true);
      try {
        const messages = combinedData.find((converdation) => converdation.id === conversation.id)?.messages;

        if (!messages) return;
        const conversationConcatenated = messages.map((msg: any) => msg.message).join('\n');
        const response = await axios.post('http://localhost:80/summarize', {
          conversation: conversationConcatenated,
        });

        if (response.data && response.data.summary) {
          setSummary(response.data.summary);
        } else {
          setSummary('No se pudo generar el resumen.');
        }
      } catch (error) {
        console.error('Error al generar resumen:', error);
        setSummary('Error al generar el resumen.');
      }
      setLoadingSummary(false);
    };

    generateSummary();
  }, [conversation.id]);

  // Función para actualizar lastReviewDate en la conversación
  const updateConversation = async () => {
    const payload = {
      lastReviewDate: serverTimestamp() as unknown as Timestamp,
      status: newStatus,
    };

    try {
      await SERVICES.CMS.update(Entities.conversations, conversation.id, payload);
      onStatusChange(newStatus);
    } catch (error) {
      console.error('Error al actualizar lastReviewDate', error);
    }
  };

  // Al confirmar sin cambiar el estado: guarda en reviews con confirmed: true y actualiza lastReviewDate
  const handleConfirm = async () => {
    try {
      setIsLoading(true);

      await SERVICES.CMS.create(Entities.reviews, {
        conversationId: conversation.id,
        confirmed: true,
      });
      await updateConversation();

      onClose();
      setIsLoading(false);
    } catch (error) {
      console.error('Error al crear la review de confirmación', error);
    }
  };

  // Al cambiar de estado: guarda en reviews con confirmed: false, registra el cambio y actualiza lastReviewDate
  const handleStateChange = async () => {
    try {
      setIsLoading(true);

      const payload: IReview = {
        conversationId: conversation.id,
        confirmed: false,
        changes: [conversation.status, newStatus],
      };

      await SERVICES.CMS.create(Entities.reviews, payload);
      await updateConversation();

      onClose();
      setShowStateChangePopup(false);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al actualizar el estado de la conversación', error);
    }
  };

  // Calcula los estados disponibles (excluyendo el actual)
  const availableStates = Object.values(ConversationStatusEnum).filter((state) => {
    // Excluir el estado actual
    if (state === conversation.status) return false;
    // Si se quiere cambiar a SALES, solo permitirlo si el estado actual es LEAD
    if (state === ConversationStatusEnum.SALES && conversation.status !== ConversationStatusEnum.LEAD)
      return false;
    return true;
  });

  const handleFullRefundToggle = async () => {
    try {
      const newRefundStatus = !fullRefunded;
      setFullRefunded(newRefundStatus);

      const filters: IFilter[] = [
        {
          field: 'conversationId',
          operator: '==',
          value: conversation.id,
        },
      ];

      const res = await SERVICES.CMS.get(Entities.sales, filters);

      if (!res || res.length === 0) {
        UTILS.POPUPS.simplePopUp('Documento no encontrado');
        return;
      }

      const salesDocId = res[0].id;

      await SERVICES.CMS.update(Entities.sales, salesDocId, { fullRefunded: newRefundStatus });
    } catch (error) {
      console.error('Error al actualizar el estado de reembolso:', error);
    }
  };

  const handlePartialRefundToggle = async () => {
    try {
      const newRefundStatus = !partialRefunded;
      setPartialRefunded(newRefundStatus);

      const filters: IFilter[] = [
        {
          field: 'conversationId',
          operator: '==',
          value: conversation.id,
        },
      ];

      const res = await SERVICES.CMS.get(Entities.sales, filters);

      if (!res || res.length === 0) {
        UTILS.POPUPS.simplePopUp('Documento no encontrado');
        return;
      }

      const salesDocId = res[0].id;

      await SERVICES.CMS.update(Entities.sales, salesDocId, { partialRefunded: newRefundStatus });
    } catch (error) {
      console.error('Error al actualizar el estado de reembolso:', error);
    }
  };

  useEffect(() => {
    const doAsync = async () => {
      const filters: IFilter[] = [
        {
          field: 'conversationId',
          operator: '==',
          value: conversation.id,
        },
      ];

      const res = await SERVICES.CMS.get(Entities.sales, filters);

      if (!res) {
        UTILS.POPUPS.simplePopUp('Documento no encontrado');

        return;
      }

      const sales = res[0];

      setFullRefunded(sales.fullRefunded);
      setPartialRefunded(sales.partialRefunded);
    };

    if (conversation.status === ConversationStatusEnum.SALES) {
      doAsync();
    }
  }, [conversation.status]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded shadow-lg p-6 relative"
        style={{ width: '1300px', height: '1050px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-xl text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-center font-bold">DETALLE DE LA CONVERSACION</h2>
        <div className="flex gap-5 mt-3">
          <div className="flex gap-5">
            <div className="px-3 py-2 bg-gray-50 rounded shadow  flex gap-2">
              <h2 className="text-center font-bold">Mensajes:</h2>
              <h2 className="text-center font-bold">
                {combinedData &&
                  combinedData.find((converdation) => converdation.id === conversation.id)?.messages.length}
              </h2>
            </div>
            <div className="px-3 py-2 bg-gray-50 rounded shadow  flex gap-2">
              <h2 className="text-center font-bold">Antiguedad:</h2>
              <h2 className="text-center font-bold">
                {combinedData &&
                  (() => {
                    const conversationData = combinedData.find(
                      (conversation) => conversation.id === conversation.id,
                    );
                    if (!conversationData) return null;
                    const createdAtTime = conversationData.createdAt.toDate().getTime();
                    const currentTime = new Date().getTime();
                    return Math.floor((currentTime - createdAtTime) / (1000 * 60 * 60 * 24));
                  })()}{' '}
                días
              </h2>
            </div>

            <div className="px-3 py-2 bg-gray-50 rounded shadow  flex gap-2">
              <h2 className="text-center font-bold">Días con actividad:</h2>
              <h2 className="text-center font-bold">
                {combinedData &&
                  (() => {
                    const conversationData = combinedData.find((conv) => conv.id === conversation.id);
                    if (!conversationData) return null;

                    const uniqueDays = new Set(
                      conversationData.messages.map((message) => {
                        const date = new Date(message.createdAt.seconds * 1000);
                        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
                      }),
                    );

                    return uniqueDays.size;
                  })()}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex h-[950px] pt-4">
          {/* Columna izquierda: detalles y acciones */}
          <div className="w-1/2 pr-4 border-gray-300">
            <div className="flex flex-col gap-3">
              {/* Datos */}
              <div className="flex flex-col h-60 gap-3  pr-4">
                <h3 className="font-bold mb-1">Datos</h3>
                <div className="flex gap-2">
                  <Typo type="body2Semibold">Teléfono:</Typo>
                  <Typo type="body2">{conversation.phoneNumber}</Typo>
                </div>
                <div className="flex gap-2">
                  <Typo type="body2Semibold">Nombre:</Typo>
                  <Typo
                    type="body2"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {conversation.name || 'No colectado'}
                  </Typo>
                </div>
                <div className="flex gap-2">
                  <Typo type="body2Semibold">Apellido:</Typo>
                  <Typo
                    type="body2"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {conversation.lastName || 'No colectado'}
                  </Typo>
                </div>
                <div className="flex gap-2">
                  <Typo type="body2Semibold">Estado Actual:</Typo>
                  <Typo type="body2">{statusMap(conversation.status)}</Typo>
                </div>
                <hr className="my-4 border-gray-400" />
              </div>
              <>
                <h3 className="font-bold">Log de Revisiones</h3>
                <div className="max-h-52 h-52 overflow-auto scroll-custom pr-4">
                  {reviews.length === 0 ? (
                    <p className="text-gray-600">No hay revisiones.</p>
                  ) : (
                    reviews
                      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                      .map((review, index) => (
                        <div key={index} className="border-b py-2 flex items-start">
                          <div className="mr-2">
                            <Typo type="body2">
                              {UTILS.DATES.firestoreTimeToDate(review.createdAt).toLocaleString()}
                            </Typo>
                          </div>
                          <div>
                            <Typo type="body2">
                              {review.confirmed
                                ? 'Revisado'
                                : `Cambio de Estado: ${statusMap(review.changes?.[0])} -> ${statusMap(
                                    review.changes?.[1],
                                  )}`}
                            </Typo>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                <hr className="my-6 border-gray-400" />
              </>
              <>
                <h3 className="font-bold mb-1">Resumen</h3>
                <div
                  className={`pr-4 max-h-60 h-60 overflow-auto scroll-custom flex ${
                    loadingSummary ? 'items-center' : 'items-start'
                  } justify-center`}
                >
                  {loadingSummary ? (
                    <div className="text-center">
                      <Typo type="body2">Generando resumen...</Typo>
                    </div>
                  ) : (
                    <Typo type="body2">{summary || 'No hay resumen.'}</Typo>
                  )}
                </div>
              </>
            </div>
            {conversation.status !== ConversationStatusEnum.SALES && (
              <div className="flex justify-end mt-6 gap-4">
                <button
                  disabled={isLoading}
                  onClick={() => {
                    // Al abrir el popup, inicializamos newStatus con el primer estado disponible
                    if (availableStates.length > 0) {
                      setNewStatus(availableStates[0]);
                    }
                    setShowStateChangePopup(true);
                  }}
                  className="px-4 py-2 red text-white rounded"
                >
                  Cambiar de Estado
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleConfirm}
                  className="px-4 py-2 green text-white rounded"
                >
                  Confirmar estado
                </button>
              </div>
            )}
            <div className="flex items-center gap-5 mt-4">
              {typeof fullRefunded !== 'undefined' &&
                typeof partialRefunded !== 'undefined' &&
                !partialRefunded && (
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      checked={fullRefunded}
                      onChange={handleFullRefundToggle}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label className="text-lg font-semibold cursor-pointer">Reembolso total</label>
                  </div>
                )}
              {typeof partialRefunded !== 'undefined' &&
                typeof fullRefunded !== 'undefined' &&
                !fullRefunded && (
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      checked={partialRefunded}
                      onChange={handlePartialRefundToggle}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <label className="text-lg font-semibold cursor-pointer">Reembolso parcial</label>
                  </div>
                )}
            </div>
          </div>
          {/* Columna derecha: ChatDetail */}
          <div className="w-1/2 pl-4 pb-5 flex z-0">
            <div className="h-full border-l"></div>
            <ChatDetail conversationId={conversation.phoneNumber} statusView={true} />
          </div>
        </div>

        {/* Popup para cambio de estado */}
        {showStateChangePopup && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60"
            onClick={() => setShowStateChangePopup(false)}
          >
            <div
              className="bg-white rounded shadow-lg p-4 relative"
              style={{ width: '400px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-center mb-4">Cambiar de Estado</h3>
              <div className="flex items-center justify-center mb-4">
                <Typo type="body2" style={{ marginRight: '8px' }}>
                  {conversation.status}
                </Typo>
                <Typo type="body2" style={{ marginRight: '8px' }}>
                  →
                </Typo>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ConversationStatusEnum)}
                  className="border p-2 rounded"
                >
                  {availableStates.map((state) => (
                    <option key={state} value={state}>
                      {statusMap(state)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  disabled={isLoading}
                  onClick={() => setShowStateChangePopup(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded"
                >
                  Cancelar
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleStateChange}
                  className="px-6 py-2 green text-white rounded"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationCardDetail;
