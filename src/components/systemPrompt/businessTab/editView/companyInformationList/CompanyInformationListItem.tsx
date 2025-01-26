import { useBusinessContext } from 'contexts/BusinessProvider';
import useBulletFunctions, { PromptComponentsEnum } from 'customHooks/bullets';
import { bulletOptions } from 'enums/systemPrompts'; // Ajusta la ruta si tus opciones están en otro lugar
import { useState, useRef } from 'react';
import { IOptionTextItem } from 'types';
import { v4 as uuidv4 } from 'uuid';

const CompanyInformationListItem = ({
  infoItem,
  index,
  tempCompanyInformationLength,
}: {
  infoItem: IOptionTextItem;
  index: number;
  tempCompanyInformationLength: number;
}) => {
  const { setTempBusinessData } = useBusinessContext();

  const { deleteBullet, moveUpBullet, moveDownBullet } = useBulletFunctions(PromptComponentsEnum.COMPANY);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
    setIsExpanded(false);
  };

  const handleConfirmEdit = () => {
    setTempBusinessData((prev) => {
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
  };

  return (
    <div className="relative bg-white border rounded p-2 flex flex-col">
      <div className="relative bg-white flex h-[45px] justify-first items-center">
        {isEditing ? (
          <input
            value={tempOption}
            onChange={(e) => setTempOption(e.target.value)}
            className="border p-1 flex-grow"
          />
        ) : (
          <span className="font-bold border rounded flex-grow p-2">{infoItem.option}</span>
        )}

        <div className="flex items-center justify-center gap-2 ml-2">
          {isEditing ? (
            <>
              <button onClick={handleConfirmEdit} className="bg-green-500 px-2 rounded w-[35px] h-[35px]">
                ✓
              </button>
              <button onClick={handleCancelEdit} className="bg-red-600 px-2 rounded w-[35px] h-[35px]">
                ✕
              </button>
            </>
          ) : (
            <>
              <button
                disabled={index === tempCompanyInformationLength - 1}
                onClick={() => {
                  setIsExpanded(false);
                  moveDownBullet(index);
                }}
                className={`${
                  index === tempCompanyInformationLength - 1 ? 'bg-gray-400' : 'bg-gray-200'
                } px-2 rounded w-[35px] h-[35px]`}
              >
                ↓
              </button>

              <button
                disabled={index === 0}
                onClick={() => {
                  setIsExpanded(false);
                  moveUpBullet(index);
                }}
                className={`${index === 0 ? 'bg-gray-400' : 'bg-gray-200'} px-2 rounded w-[35px] h-[35px]`}
              >
                ↑
              </button>

              <button
                onClick={() => deleteBullet(index)}
                className="bg-red-600 px-2 rounded w-[35px] h-[35px] flex items-center justify-center"
              >
                🗑️
              </button>

              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsExpanded(true);
                }}
                className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
              >
                ✎
              </button>
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div
          ref={containerRef}
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[600px] overflow-auto' : 'max-h-[40px] overflow-hidden'
          }`}
        >
          {isEditing ? (
            <textarea
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              className="border p-1 w-full mt-2"
            />
          ) : (
            <p className="mt-2">Descripción: {infoItem.text}</p>
          )}

          {isEditing && (
            <div className="mt-2">
              <select
                className="border rounded px-2 py-2 w-1/2"
                value={tempOption}
                onChange={(e) => setTempOption(e.target.value)}
              >
                {bulletOptions.map((section) => (
                  <optgroup key={uuidv4()} label={section.label}>
                    {section.options.map((opt) => (
                      <option key={uuidv4()} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center">
        <button onClick={toggleExpand} className="text-gray-500 hover:text-black flex items-center">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
};

export default CompanyInformationListItem;
