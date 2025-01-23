// ** InformationList.tsx
import { v4 as uuidv4 } from 'uuid';
import AssistantInformationListItem from './KnowledgeContextInformationListItem';
import { useAssistantContext } from 'contexts/AssistantProvider';

const KnowledgeContextInformationList = () => {
  const { tempAssistantData } = useAssistantContext();

  return (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      {tempAssistantData.length === 0 && (
        <div className="flex w-full justify-center">No hay información de la empresa</div>
      )}

      <div className="space-y-2">
        {tempAssistantData.map((infoItem, index) => (
          <AssistantInformationListItem
            key={uuidv4()}
            infoItem={infoItem}
            index={index}
            tempAssistantDataLength={tempAssistantData.length}
          />
        ))}
      </div>
    </div>
  );
};

export default KnowledgeContextInformationList;
