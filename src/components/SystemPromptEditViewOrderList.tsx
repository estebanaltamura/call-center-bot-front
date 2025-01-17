// SystemPromptEditViewListBullet.tsx
import { useEffect, useRef, useState } from 'react';
import { useSystemPromptContext } from 'contexts/SystemPromptProvider';
import { OrderedListType } from './SystemPromptEditViewContainer';
import Typo from './Typo';

const SystemPromptEditViewOrderList = ({
  data,
  index,
  bulletslength,
  setServicesOrderIndex,
  servicesOrderIndex,
  bulletIndex,
  dataLength,
}: {
  data: OrderedListType;
  index: number;
  bulletslength: number;
  setServicesOrderIndex: React.Dispatch<React.SetStateAction<number>>;
  servicesOrderIndex: number;
  bulletIndex: number;
  dataLength: number;
}) => {
  const { moveUpBullets, moveDownBullets, deleteBullet, updatePrompt } = useSystemPromptContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Verificar si el contenido del textarea sobrepasa la altura visible
  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setIsOverflowing(element.scrollHeight > element.offsetHeight);
    }
  }, [prompt]);

  // Siempre scrollear hacia arriba al contraer
  useEffect(() => {
    if (!isExpanded && textRef.current) {
      textRef.current.scrollTo(0, 0);
    }
  }, [isExpanded]);

  return (
    <>
      {data.type === 'service' && (
        <div className="relative bg-[#3b82f6] border rounded py-4 px2 flex align-center justify-center">
          <Typo type="title2Semibold">SERVICIOS</Typo>

          <div className="absolute right-2 flex items-center justify-end space-x-1">
            {index < dataLength && (
              <button
                onClick={() => {
                  setIsExpanded(false);
                  data.type === 'service' && setServicesOrderIndex(servicesOrderIndex + 1);
                }}
                className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
              >
                ↓
              </button>
            )}
            {index > 0 && (
              <button
                onClick={() => {
                  setIsExpanded(false);
                  data.type === 'service' && setServicesOrderIndex(servicesOrderIndex - 1);
                }}
                className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
              >
                ↑
              </button>
            )}
          </div>
        </div>
      )}

      {data.type === 'bullet' && (
        <div className="relative bg-white border rounded p-2 flex flex-col">
          <div className="flex justify-end items-center mb-2">
            <div className="flex items-center justify-end space-x-1">
              {bulletIndex > 0 && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    data.type === 'bullet' && moveUpBullets(bulletIndex);
                  }}
                  className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
                >
                  ↑
                </button>
              )}
              {bulletIndex < bulletslength - 1 && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    data.type === 'bullet' && moveDownBullets(bulletIndex);
                  }}
                  className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
                >
                  ↓
                </button>
              )}
              <button
                onClick={() => deleteBullet(bulletIndex)}
                className="bg-red-600 text-white px-1 py-1 rounded w-[30px] h-[30px]"
              >
                🗑️
              </button>
            </div>
          </div>

          <textarea
            ref={textRef}
            defaultValue={data.text} // Usamos defaultValue en lugar de value para evitar overwriting en cada re-render
            className={`
            w-full border p-2 rounded resize-none scroll-custom
            transition-all duration-300 ease-in-out
            ${isExpanded ? 'overflow-auto' : 'overflow-hidden'}
          `}
            style={{
              height: isExpanded ? `${textRef.current?.scrollHeight}px` : '40px',
              maxHeight: isExpanded ? '600px' : '48px',
            }}
          />

          {isOverflowing && (
            <div className="flex justify-center">
              <button onClick={toggleExpand} className="text-gray-500 hover:text-black flex items-center">
                {isExpanded ? '▲' : '▼'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SystemPromptEditViewOrderList;
