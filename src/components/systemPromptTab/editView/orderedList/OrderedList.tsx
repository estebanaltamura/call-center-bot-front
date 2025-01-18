import { OrderedListType } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSystemPromptContext } from 'contexts/SystemPromptsProvider';
import Typo from 'components/general/Typo';

const OrderedList = ({
  orderedList,
  servicesOrderIndex,
  setServicesOrderIndex,
  tempBullets,
}: {
  orderedList: OrderedListType[];
  servicesOrderIndex: number;
  setServicesOrderIndex: React.Dispatch<React.SetStateAction<number>>;
  tempBullets: string[];
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
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">Ordenamiento</h2>

      <div className="space-y-2">
        {orderedList.map((item, index) => {
          const bulletIndex = index < servicesOrderIndex ? index : index - 1;

          return (
            <>
              {item.type === 'noData' && (
                <div className="flex w-full justify-center">No hay bullets ni servicios agregados</div>
              )}

              {item.type === 'service' && (
                <div className="relative bg-[#3b82f6] border rounded py-4 px-2 flex h-[73px] justify-center items-center">
                  <Typo type="title2Semibold">SERVICIOS</Typo>

                  <div className="absolute right-2 flex items-center justify-center gap-2">
                    <button
                      disabled={index === orderedList.length}
                      onClick={() => {
                        setIsExpanded(false);
                        item.type === 'service' && setServicesOrderIndex(servicesOrderIndex + 1);
                      }}
                      className={`${
                        index === orderedList.length ? 'bg-gray-400' : 'bg-gray-200'
                      } px-2 rounded w-[35px] h-[35px]`}
                    >
                      ↓
                    </button>

                    <button
                      disabled={index === 0}
                      onClick={() => {
                        setIsExpanded(false);
                        item.type === 'service' && setServicesOrderIndex(servicesOrderIndex - 1);
                      }}
                      className={`${
                        index === 0 ? 'bg-gray-400' : 'bg-gray-200'
                      } px-2 rounded w-[35px] h-[35px]`}
                    >
                      ↑
                    </button>

                    <div className="bg-[#3b82f6] px-2 w-[35px] h-[35px]"></div>
                  </div>
                </div>
              )}

              {item.type === 'bullet' && (
                <div className="relative bg-white border rounded p-2 flex flex-col">
                  <div className="flex justify-between items-start">
                    {/* Contenedor del textarea y botones */}
                    <textarea
                      ref={textRef}
                      defaultValue={item.text} // Usamos defaultValue en lugar de value para evitar overwriting en cada re-render
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
                      {bulletIndex < tempBullets.length - 1 ? (
                        <button
                          onClick={() => {
                            setIsExpanded(false);
                            bulletIndex !== servicesOrderIndex - 1 && moveDownBullets(bulletIndex);
                            bulletIndex === servicesOrderIndex - 1 &&
                              setServicesOrderIndex(servicesOrderIndex - 1);
                          }}
                          className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
                        >
                          ↓
                        </button>
                      ) : bulletIndex === tempBullets.length - 1 &&
                        servicesOrderIndex === tempBullets.length ? (
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
                      <button
                        onClick={toggleExpand}
                        className="text-gray-500 hover:text-black flex items-center"
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default OrderedList;
