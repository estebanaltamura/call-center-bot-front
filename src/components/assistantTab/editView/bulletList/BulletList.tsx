// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

// ** Components
import Typo from 'components/general/Typo';
import { useAssistantContext } from 'contexts/AssistantProvider';
import BulletEditContainer from '../assistantInformationList/BulletEditContainer';

const BulletList = ({
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

  if (!tempAssistantInformation.length) return <></>;

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <div className="space-y-2">
        <>
          {tempAssistantInformation && tempAssistantInformation.length > 0 && (
            <div key={uuidv4()} className="flex flex-col border border-black rounded">
              <div className="relative bg-blue-600  flex h-[40px] justify-center items-center rounded-t">
                <Typo type="body1Semibold" style={{ color: 'white' }}>
                  BULLETS
                </Typo>
              </div>
              <BulletEditContainer
                itemEditingIndex={itemEditingIndex}
                setitemEditingIndex={setitemEditingIndex}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default BulletList;
