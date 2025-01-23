// ** InformationList.tsx
import { v4 as uuidv4 } from 'uuid';
import AssistantInformationListItem from './BulletEditItem';
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useEffect, useState } from 'react';

const BulletEditContainer = ({
  isEditing,
  setIsEditing,
  itemEditingIndex,
  setitemEditingIndex,
}: {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  itemEditingIndex: number | null;
  setitemEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { tempAssistantInformation } = useAssistantContext();

  useEffect(() => {
    typeof itemEditingIndex === 'number' ? setIsEditing(true) : setIsEditing(false);
  }, [itemEditingIndex]);

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
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            itemEditingIndex={itemEditingIndex}
            setitemEditingIndex={setitemEditingIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default BulletEditContainer;
