// ** InformationList.tsx
import { v4 as uuidv4 } from 'uuid';
import AssistantInformationListItem from './KnowledgeContextInformationListItem';
import { useAssistantContext } from 'contexts/AssistantProvider';

const KnowledgeContextInformationList = () => {
  const { tempAssistantInformation } = useAssistantContext();

  return (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      {tempAssistantInformation.length === 0 && (
        <div className="flex w-full justify-center">No hay información de la empresa</div>
      )}

      <div className="space-y-2">
        {tempAssistantInformation.map((infoItem, index) => (
          <AssistantInformationListItem
            key={uuidv4()}
            infoItem={infoItem}
            index={index}
            tempAssistantInformationLength={tempAssistantInformation.length}
          />
        ))}
      </div>
    </div>
  );
};

export default KnowledgeContextInformationList;
