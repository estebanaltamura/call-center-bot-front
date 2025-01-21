// ** InformationList.tsx
import { v4 as uuidv4 } from 'uuid';
import RulesInformationListItem from './RulesInformationListItem';
import { useRulesContext } from 'contexts/RulesProvider';

const RulesInformationList = () => {
  const { tempRulesInformation } = useRulesContext();

  return (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      {tempRulesInformation.length === 0 && (
        <div className="flex w-full justify-center">No hay información de la empresa</div>
      )}

      <div className="space-y-2">
        {tempRulesInformation.map((infoItem, index) => (
          <RulesInformationListItem
            key={uuidv4()}
            infoItem={infoItem}
            index={index}
            tempRulesInformationLength={tempRulesInformation.length}
          />
        ))}
      </div>
    </div>
  );
};

export default RulesInformationList;
