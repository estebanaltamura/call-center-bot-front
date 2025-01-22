import { useAssistantContext } from 'contexts/AssistantProvider';
import useAssistantInformation from 'customHooks/assistant/assistantInformation';
import { bulletOptions } from 'enums/systemPrompts'; // Ajusta la ruta si tus opciones están en otro lugar
import { useState, useRef, useEffect } from 'react';
import { IOptionTextItem } from 'types';
import { v4 as uuidv4 } from 'uuid';

const AssistantInformationListItem = ({
  infoItem,
  index,
  tempAssistantInformationLength,
  isEditing,
  setIsEditing,
  itemEditingIndex,
  setitemEditingIndex,
}: {
  infoItem: IOptionTextItem;
  index: number;
  tempAssistantInformationLength: number;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  itemEditingIndex: number | null;
  setitemEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const { setTempAssistantInformation } = useAssistantContext();

  const { deleteAssistantInformationItem, moveUpAssistantInformationItem, moveDownAssistantInformationItem } =
    useAssistantInformation();

  const [isExpanded, setIsExpanded] = useState(false);

  const [tempOption, setTempOption] = useState(infoItem.option);
  const [tempText, setTempText] = useState(infoItem.text);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setTempOption(infoItem.option);
    setTempText(infoItem.text);
    setIsEditing(false);
    setitemEditingIndex(null);
    setIsExpanded(false);
  };

  const handleConfirmEdit = () => {
    setTempAssistantInformation((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        option: tempOption,
        text: tempText,
      };
      return updated;
    });
    setIsExpanded(false);
    setIsEditing(false);
    setitemEditingIndex(null);
  };

  const showComponent = (isEditing && itemEditingIndex === index) || !isEditing;

  if (!showComponent) return <></>;

  return (
    <div className="relative bg-white border rounded flex flex-col">
      {isEditing && (
        <div className="bg-blue-600 text-white text-center p-2 font-bold rounded-t">MODO EDICIÓN</div>
      )}

      <div className="relative bg-white flex flex-col pt-2 pb-0 px-2 rounded">
        {/* Modo edición */}
        {isEditing ? (
          <>
            {/* Option */}
            <span className="font-bold mt-2 w-full ml-[7px]">{tempOption}</span>

            {/* Textarea */}
            <textarea
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              rows={14}
              className="border rounded p-2 w-full mt-2 scroll-custom"
            />

            {/* Botones para guardar y cancelar */}
            <div className="flex justify-between gap-2 w-full mt-2">
              <button onClick={handleCancelEdit} className="bg-red-600 px-4 py-2 rounded text-white w-1/2">
                Cancelar
              </button>
              <button
                disabled={tempText.trim() === ''}
                onClick={handleConfirmEdit}
                className={`bg-green-600 px-4 py-2 rounded text-white w-1/2 ${
                  tempText.trim() === '' && 'disabled'
                }`}
              >
                Guardar
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Modo normal */}
            <div className="flex h-[40px] justify-between items-center">
              <span className="font-bold border rounded flex-grow p-2 h-[40px]">{infoItem.option}</span>

              {/* Botones de acciones normales */}
              <div className="flex items-center justify-center gap-2 ml-2">
                <button
                  disabled={index === tempAssistantInformationLength - 1}
                  onClick={() => {
                    setIsExpanded(false);
                    moveDownAssistantInformationItem(index);
                  }}
                  className={`${
                    index === tempAssistantInformationLength - 1 ? 'bg-gray-400' : 'bg-gray-200'
                  } px-2 rounded flex items-center w-[40px] h-[40px] justify-center`}
                >
                  ↓
                </button>

                <button
                  disabled={index === 0}
                  onClick={() => {
                    setIsExpanded(false);
                    moveUpAssistantInformationItem(index);
                  }}
                  className={`${
                    index === 0 ? 'bg-gray-400' : 'bg-gray-200'
                  } px-2 rounded flex items-center w-[40px] h-[40px] justify-center`}
                >
                  ↑
                </button>

                <button
                  onClick={() => {
                    setIsEditing(true);
                    setitemEditingIndex(index);
                    setIsExpanded(true);
                  }}
                  className="bg-gray-200 px-2 rounded flex items-center w-[40px] h-[40px] justify-center"
                >
                  ✎
                </button>

                <button
                  onClick={() => deleteAssistantInformationItem(index)}
                  className="bg-red-600 px-2 rounded flex items-center w-[40px] h-[40px] justify-center"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Descripción y botón de expandir */}
            {isExpanded && (
              <p ref={containerRef} className="mt-2 ml-2 max-h-[500px] overflow-y-auto scroll-custom">
                {infoItem.text}
              </p>
            )}
          </>
        )}
      </div>

      {/* Botón para expandir/colapsar */}
      {!isEditing && (
        <div className="flex justify-center h-[22px] mb-[2px]">
          <button onClick={toggleExpand} className="text-black flex items-center">
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AssistantInformationListItem;
