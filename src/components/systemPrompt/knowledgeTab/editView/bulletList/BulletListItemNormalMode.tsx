// ** React
import { useEffect, useState } from 'react';

// ** Thrid Party libraries
import { v4 as uuidv4 } from 'uuid';

// ** Contexts
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';

// ** Hooks
import useKnowledgeInformation, { PromptComponentsEnum } from 'customHooks/bullets';
import useKnowledgeBulletFunctions from 'customHooks/bullets';
import useBulletFunctions from 'customHooks/bullets';

interface IBulletListItemProps {
  index: number;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  itemEditingIndex: number | null;
  setitemEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const BulletListItemNormalMode = ({
  index,
  setIsEditing,
  itemEditingIndex,
  setitemEditingIndex,
}: IBulletListItemProps) => {
  // Contexts
  const { tempKnowledgeData } = useKnowledgeContext();
  const { deleteBullet, moveUpBullet, moveDownBullet } = useBulletFunctions(PromptComponentsEnum.KNOWLEDGE);

  // States
  const [isExpanded, setIsExpanded] = useState(false);

  const optionInitialValue: string = tempKnowledgeData[index].option;
  const textInitialValue: string = tempKnowledgeData[index].text;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  useEffect(() => {
    setIsEditing(typeof itemEditingIndex === 'number');
  }, [itemEditingIndex, setIsEditing]);

  // Render principal según isEditing
  return (
    <div key={uuidv4()} className="relative bg-white border rounded flex flex-col">
      <div className="relative bg-white flex flex-col pt-2 pb-0 px-2 rounded">
        <div className="flex h-[40px] justify-between items-center">
          <span className="font-bold border rounded flex-grow p-2 h-[40px]">{optionInitialValue}</span>

          <div className="flex items-center justify-center gap-2 ml-2">
            <button
              disabled={index === tempKnowledgeData.length - 1}
              onClick={() => {
                setIsExpanded(false);
                moveDownBullet(index);
              }}
              className={`${
                index === tempKnowledgeData.length - 1 ? 'bg-gray-400' : 'bg-gray-200'
              } px-2 rounded flex items-center w-[40px] h-[40px] justify-center`}
            >
              ↓
            </button>

            <button
              disabled={index === 0}
              onClick={() => {
                setIsExpanded(false);
                moveUpBullet(index);
              }}
              className={`${
                index === 0 ? 'bg-gray-400' : 'bg-gray-200'
              } px-2 rounded flex items-center w-[40px] h-[40px] justify-center`}
            >
              ↑
            </button>

            <button
              onClick={() => {
                setitemEditingIndex(index);
                setIsEditing(true);

                setIsExpanded(true);
              }}
              className="bg-gray-200 px-2 rounded flex items-center w-[40px] h-[40px] justify-center"
            >
              ✎
            </button>

            <button
              onClick={() => deleteBullet(index)}
              className="red px-2 rounded flex items-center w-[40px] h-[40px] justify-center"
            >
              🗑️
            </button>
          </div>
        </div>

        {isExpanded && (
          <p className="mt-2 ml-2 max-h-[500px] overflow-y-auto scroll-custom">{textInitialValue}</p>
        )}
      </div>

      <div className="flex justify-center h-[22px] mb-[2px]">
        <button onClick={toggleExpand} className="text-black flex items-center">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
};

export default BulletListItemNormalMode;
