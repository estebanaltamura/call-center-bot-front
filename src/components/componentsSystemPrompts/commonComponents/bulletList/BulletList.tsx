// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

// ** Context
import { useDataContext } from 'contexts/DataContextProvider';

// ** Components
import Typo from 'components/general/Typo';
import BulletListItemEditMode from './BulletListItemEditMode';
import BulletListItemNormalMode from './BulletListItemNormalMode';

// ** Types
import { PromptComponentsEnum } from 'types';

interface IBulletListProps {
  promptComponentType: PromptComponentsEnum;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  itemEditingIndex: number | null;
  setitemEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  disabled?: boolean;
}

const BulletList = ({
  promptComponentType,
  isEditing,
  setIsEditing,
  itemEditingIndex,
  setitemEditingIndex,
  disabled,
}: IBulletListProps) => {
  const { tempBullets, setTempBullets } = useDataContext(promptComponentType);

  if (!tempBullets.length) {
    return (
      <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
        <div className="flex justify-center">No hay bullets añadidos</div>
      </div>
    );
  }

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <div className="flex flex-col border border-black rounded">
        <div className="relative bg-blue-600 flex h-[40px] justify-center items-center rounded-t">
          <Typo type="body1Semibold" style={{ color: 'white' }}>
            BULLETS
          </Typo>
        </div>

        <div className="p-4 space-y-2">
          {isEditing && itemEditingIndex !== null ? (
            <BulletListItemEditMode
              setIsEditing={setIsEditing}
              itemEditingIndex={itemEditingIndex}
              setitemEditingIndex={setitemEditingIndex}
              tempBullets={tempBullets}
              setTempBullets={setTempBullets}
            />
          ) : (
            // Modo normal: renderizamos todos los ítems
            tempBullets.map((_, idx) => (
              <BulletListItemNormalMode
                key={uuidv4()}
                index={idx}
                setIsEditing={setIsEditing}
                itemEditingIndex={null}
                setitemEditingIndex={setitemEditingIndex}
                disabled={disabled}
                tempBullets={tempBullets}
                promptComponentType={promptComponentType}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BulletList;
