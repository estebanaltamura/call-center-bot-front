// SystemPromptEditViewListBullet.tsx
import { useEffect, useRef, useState } from 'react';
import { useSystemPromptContext } from 'contexts/SystemPromptsProvider';
import { OrderedListType } from './EditViewContainer';
import Typo from '../../general/Typo';

const EditViewOrderList = ({
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
      {data.type === 'noData' && (
        <div className="flex w-full justify-center">No hay bullets ni servicios agregados</div>
      )}

      {data.type === 'service' && (
        <div className="relative bg-[#3b82f6] border rounded py-4 px-2 flex h-[73px] justify-center items-center">
          <Typo type="title2Semibold">SERVICIOS</Typo>

          <div className="absolute right-2 flex items-center justify-center gap-2">
            <button
              disabled={index === dataLength}
              onClick={() => {
                setIsExpanded(false);
                data.type === 'service' && setServicesOrderIndex(servicesOrderIndex + 1);
              }}
              className={`${
                index === dataLength ? 'bg-gray-400' : 'bg-gray-200'
              } px-2 rounded w-[35px] h-[35px]`}
            >
              ↓
            </button>

            <button
              disabled={index === 0}
              onClick={() => {
                setIsExpanded(false);
                data.type === 'service' && setServicesOrderIndex(servicesOrderIndex - 1);
              }}
              className={`${index === 0 ? 'bg-gray-400' : 'bg-gray-200'} px-2 rounded w-[35px] h-[35px]`}
            >
              ↑
            </button>

            <div className="bg-[#3b82f6] px-2 w-[35px] h-[35px]"></div>
          </div>
        </div>
      )}

      {data.type === 'bullet' && (
        <div className="relative bg-white border rounded p-2 flex flex-col">
          <div className="flex justify-between items-start">
            {/* Contenedor del textarea y botones */}
            <textarea
              ref={textRef}
              defaultValue={data.text} // Usamos defaultValue en lugar de value para evitar overwriting en cada re-render
              className={`
          w-full border p-2 rounded resize-none scroll-custom
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'overflow-auto' : 'overflow-hidden'}
          flex-grow
        `}
              style={{
                height: isExpanded ? `${textRef.current?.scrollHeight}px` : '40px',
                maxHeight: isExpanded ? '600px' : '48px',
              }}
            />

            <div className="flex  gap-2 ml-2 h-[40px] justify-center items-center">
              {bulletIndex < bulletslength - 1 ? (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    bulletIndex !== servicesOrderIndex - 1 && moveDownBullets(bulletIndex);
                    bulletIndex === servicesOrderIndex - 1 && setServicesOrderIndex(servicesOrderIndex - 1);
                  }}
                  className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
                >
                  ↓
                </button>
              ) : bulletIndex === bulletslength - 1 && servicesOrderIndex === bulletslength ? (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setServicesOrderIndex(servicesOrderIndex - 1);
                  }}
                  className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
                >
                  ↓
                </button>
              ) : (
                <button disabled className="bg-gray-400 px-2 rounded w-[35px] h-[35px]">
                  ↓
                </button>
              )}
              {index > 0 ? (
                <button
                  onClick={() => {
                    setIsExpanded(false);

                    //El item por encima es un bullet
                    if (bulletIndex > 0 && index !== servicesOrderIndex + 1) {
                      moveUpBullets(bulletIndex);
                    }
                    //El item por encima es un servicio aunque hay mas bullets
                    else if (bulletIndex > 0 && index === servicesOrderIndex + 1) {
                      setServicesOrderIndex(servicesOrderIndex + 1);
                    }

                    //El item por encima es un servicio y no hay mas bullets
                    else if (bulletIndex === 0 && servicesOrderIndex === 0) {
                      setServicesOrderIndex(servicesOrderIndex + 1);
                    }
                  }}
                  className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
                >
                  ↑
                </button>
              ) : (
                <button disabled className="bg-gray-400 px-2 rounded w-[35px] h-[35px]">
                  ↑
                </button>
              )}
              <button
                onClick={() => deleteBullet(bulletIndex)}
                className="bg-red-600 px-2 rounded w-[35px] h-[35px]"
              >
                🗑️
              </button>
            </div>
          </div>

          {/* Expand/Collapse toggle */}
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

export default EditViewOrderList;
