// ** React
import { useState } from 'react';

// ** Custom hooks
import useAssistantInformation from 'customHooks/assistant/assistantInformation';

// ** Enums
import { bulletOptions } from 'enums/systemPrompts';

// ** 3rd party
import { v4 as uuidv4 } from 'uuid';
import { useAssistantContext } from 'contexts/AssistantProvider';

const AddBullet = ({ isEditing }: { isEditing: boolean }) => {
  const [bulletOption, setBulletOption] = useState(bulletOptions[0].options[0]);
  const [bulletText, setBulletText] = useState('');
  const { addAssistantInformationItem } = useAssistantInformation();
  const { assistantToEdit, tempAssistantInformation } = useAssistantContext();

  const addAssistantInformationItemHandler = () => {
    if (!bulletText.trim()) return;
    addAssistantInformationItem(bulletOption, bulletText);
    setBulletText('');
  };

  const usedOptions = tempAssistantInformation.map((item) => item.option);

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">AGREGAR BULLET</h2>

      <div className="flex flex-col items-center space-y-2">
        {/* Dropdown para la parte no editable del bullet */}
        <select
          disabled={isEditing}
          className="border rounded px-2 py-2 scroll-custom w-full"
          value={bulletOption}
          onChange={(e) => setBulletOption(e.target.value)}
        >
          {bulletOptions.map((section) => (
            <optgroup key={uuidv4()} label={section.label}>
              {section.options
                .filter((opt) => !usedOptions.includes(opt))
                .map((opt) => (
                  <option key={uuidv4()} value={opt}>
                    {opt}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

        {/* Input para la parte editable del bullet */}
        <input
          disabled={isEditing}
          type="text"
          className="border rounded px-2 py-2 flex-1 w-full"
          placeholder="Ingresar descripción del bullet"
          value={bulletText}
          onChange={(e) => setBulletText(e.target.value)}
        />

        <button
          disabled={!bulletText.trim() || isEditing}
          onClick={addAssistantInformationItemHandler}
          className={`bg-blue-600 text-white px-32 py-2 rounded ${!bulletText.trim() && 'disabled'}`}
        >
          AGREGAR
        </button>
      </div>
    </div>
  );
};

export default AddBullet;
