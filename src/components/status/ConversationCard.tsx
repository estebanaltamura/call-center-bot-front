// ** Components
import Typo from 'components/general/Typo';

// ** Types
import { IConversations } from 'types/dynamicSevicesTypes';
import { Timestamp } from 'firebase/firestore';

interface ConversationCardProps {
  conversation: IConversations;
}

const ConversationCard = ({ conversation }: ConversationCardProps) => {
  const phone = conversation.phoneNumber || 'No colectado';
  const name = conversation.name || 'No colectado';
  const lastName = conversation.lastName || 'No colectado';

  const ellipsisStyle = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };

  // Convertir los Timestamps a Date
  const lastMessageDate: Date = conversation.lastMessageDate
    ? (conversation.lastMessageDate as Timestamp).toDate()
    : new Date(0);
  const lastReviewDate: Date = conversation.lastReviewDate
    ? (conversation.lastReviewDate as Timestamp).toDate()
    : new Date(0);

  const backgroundColor = lastMessageDate > lastReviewDate ? 'bg-gray-200' : 'bg-green-200';

  return (
    <div className={`p-4 rounded shadow transition-all duration-300 w-full ${backgroundColor}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Typo type="body3Semibold">Número de teléfono:</Typo>
          <Typo type="body3" style={ellipsisStyle} title={phone}>
            {phone}
          </Typo>
        </div>
        <div className="flex items-center gap-2">
          <Typo type="body3Semibold">Nombre:</Typo>
          <Typo type="body3" style={ellipsisStyle} title={name}>
            {name}
          </Typo>
        </div>
        <div className="flex items-center gap-2">
          <Typo type="body3Semibold">Apellido:</Typo>
          <Typo type="body3" style={ellipsisStyle} title={lastName}>
            {lastName}
          </Typo>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
