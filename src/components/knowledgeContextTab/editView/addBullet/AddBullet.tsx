// ** React
import { useState } from 'react';

// ** Custom hooks

// ** Enums
import { bulletOptions } from 'enums/systemPrompts';

// ** 3rd party
import { v4 as uuidv4 } from 'uuid';
import useKnowledgeContextInformation from 'customHooks/knowledgeContext/knowledgeContextInformation';

const AddBullet = () => {
  const [bulletOption, setBulletOption] = useState(bulletOptions[0].options[0]);
  const [bulletText, setBulletText] = useState('');
  const { addKnowledgeContextInformationItem } = useKnowledgeContextInformation();

  const addKnowledgeContextInformationItemHandler = () => {
    if (!bulletText.trim()) return;
    addKnowledgeContextInformationItem(bulletOption, bulletText);
    setBulletText('');
  };

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">Agregar bullet</h2>

      <div className="flex flex-col items-center space-y-4">
        {/* Dropdown para la parte no editable del bullet */}
        <select
          className="border rounded px-2 py-2 scroll-custom w-full"
          value={bulletOption}
          onChange={(e) => setBulletOption(e.target.value)}
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

        {/* Input para la parte editable del bullet */}
        <input
          type="text"
          className="border rounded px-2 py-2 flex-1 w-full"
          placeholder="Ingresar descripción del bullet"
          value={bulletText}
          onChange={(e) => setBulletText(e.target.value)}
        />

        <button
          onClick={addKnowledgeContextInformationItemHandler}
          className="bg-green-500 text-white px-32 py-2 rounded"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AddBullet;
