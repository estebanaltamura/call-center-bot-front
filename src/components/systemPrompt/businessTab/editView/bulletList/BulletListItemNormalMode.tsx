// ** React
import { useEffect, useState } from 'react';

// ** Thrid Party libraries
import { v4 as uuidv4 } from 'uuid';

// ** Contexts
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** Hooks
import useBusinessInformation, { PromptComponentsEnum } from 'customHooks/bullets';
import useBusinessBulletFunctions from 'customHooks/bullets';
import useBulletFunctions from 'customHooks/bullets';

interface IBulletListItemProps {
  index: number;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  itemEditingIndex: number | null;
  setitemEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  disabled: boolean;
}

const BulletListItemNormalMode = ({
  index,
  setIsEditing,
  itemEditingIndex,
  setitemEditingIndex,
  disabled,
}: IBulletListItemProps) => {
  // Contexts
  const { tempBullets } = useBusinessContext();
  const { deleteBullet, moveUpBullet, moveDownBullet } = useBulletFunctions(PromptComponentsEnum.BUSINESS);

  // States
  const [isExpanded, setIsExpanded] = useState(false);

  const optionInitialValue: string = tempBullets[index].option;
  const textInitialValue: string = tempBullets[index].text;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  useEffect(() => {
    setIsEditing(typeof itemEditingIndex === 'number');
  }, [itemEditingIndex, setIsEditing]);

  // Render principal según isEditing
  return (
    <div className={`${disabled ? 'disabled' : ''} relative bg-white border rounded flex flex-col`}>
      <div className={`${disabled ? 'disabled' : ''} relative bg-white flex flex-col pt-2 pb-0 px-2 rounded`}>
        <div className="flex h-[40px] justify-between items-center">
          <span className="font-bold flex-grow p-2 h-[40px]">{optionInitialValue}</span>

          <div className="flex items-center justify-center gap-2 ml-2">
            <button
              disabled={index === tempBullets.length - 1 || disabled}
              onClick={() => {
                setIsExpanded(false);
                moveDownBullet(index);
              }}
              className={`${
                index === tempBullets.length - 1 || disabled ? 'bg-gray-400' : 'bg-gray-200'
              } px-2 rounded flex items-center w-[40px] h-[40px] justify-center`}
            >
              ↓
            </button>

            <button
              disabled={index === 0 || disabled}
              onClick={() => {
                setIsExpanded(false);
                moveUpBullet(index);
              }}
              className={`${
                index === 0 || disabled ? 'bg-gray-400' : 'bg-gray-200'
              } px-2 rounded flex items-center w-[40px] h-[40px] justify-center`}
            >
              ↑
            </button>

            <button
              disabled={disabled}
              onClick={() => {
                setitemEditingIndex(index);
                setIsEditing(true);
                setIsExpanded(true);
              }}
              className={`${
                disabled ? 'bg-gray-400' : 'bg-gray-200'
              } bg-gray-200 px-2 rounded flex items-center w-[40px] h-[40px] justify-center`}
            >
              ✎
            </button>

            <button
              disabled={disabled}
              onClick={() => deleteBullet(index)}
              className={`${
                disabled ? 'bg-gray-400' : 'bg-gray-200'
              } red px-2 rounded flex items-center w-[40px] h-[40px] justify-center`}
            >
              🗑️
            </button>
          </div>
        </div>

        {isExpanded && (
          <p className="mt-2 ml-2 max-h-[500px] overflow-y-auto scroll-custom">{textInitialValue}</p>
        )}
      </div>

      <div className={`${disabled ? 'disabled' : ''} flex justify-center h-[22px] mb-[2px]`}>
        <button disabled={disabled} onClick={toggleExpand} className="text-black flex items-center">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
};

export default BulletListItemNormalMode;
