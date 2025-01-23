// ** React
import { useEffect, useState, useRef } from 'react';

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
  const { tempAssistantInformation } = useAssistantContext();

  // Guarda la última opción válida para revertir en caso de selección inválida
  const lastValidOption = useRef(bulletOption);

  // Opciones ya usadas (deshabilitadas)
  const usedOptions = Array.from(new Set(tempAssistantInformation.map((item) => item.option)));

  // Agregar bullet
  const addAssistantInformationItemHandler = () => {
    if (!bulletText.trim()) return;

    addAssistantInformationItem(bulletOption, bulletText);
    setBulletText('');

    // Actualizamos "usedOptions" localmente agregando la opción recién usada
    const updatedUsed = [...usedOptions, bulletOption];

    // Buscamos la primera opción disponible
    let nextAvailable = '';
    outer: for (const section of bulletOptions) {
      for (const opt of section.options) {
        if (!updatedUsed.includes(opt)) {
          nextAvailable = opt;
          break outer;
        }
      }
    }

    // Ajustamos bulletOption al primer no usado
    setBulletOption(nextAvailable);
    lastValidOption.current = nextAvailable; // actualizamos la última opción válida
  };

  // Verificamos si la opción seleccionada es válida;
  // si está deshabilitada, revertimos a la última opción válida
  const handleOptionChange = (newValue: string) => {
    // Si está en la lista de usadas, revertimos
    if (usedOptions.includes(newValue) || !newValue) {
      // Forzamos que el <select> muestre la última opción válida
      setBulletOption(lastValidOption.current);
      return;
    }
    setBulletOption(newValue);
    lastValidOption.current = newValue;
  };

  useEffect(() => {
    // Para debug, si quieres ver qué pasa con bulletOption en cada cambio:
    // console.log('Opción actual:', bulletOption);
  }, [bulletOption]);

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">AGREGAR BULLET</h2>

      <div className="flex flex-col items-center space-y-2">
        <select
          disabled={isEditing}
          className={`border rounded px-2 py-2 scroll-custom w-full ${isEditing ? 'disabled' : ''}`}
          value={bulletOption}
          onChange={(e) => handleOptionChange(e.target.value)}
        >
          {bulletOptions.map((section) => (
            <optgroup key={uuidv4()} label={section.label}>
              {section.options.map((opt) => {
                const isUsed = usedOptions.includes(opt);
                return (
                  <option
                    key={uuidv4()}
                    value={opt}
                    disabled={isUsed}
                    // Evita clicks sobre la opción deshabilitada
                    style={{ pointerEvents: isUsed ? 'none' : 'auto' }}
                    className={isUsed ? 'bg-gray-300 text-gray-600' : ''}
                  >
                    {opt}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>

        <input
          disabled={isEditing}
          type="text"
          className={`border rounded px-2 py-2 flex-1 w-full ${isEditing ? 'disabled' : ''}`}
          placeholder="Ingresar descripción del bullet"
          value={bulletText}
          onChange={(e) => setBulletText(e.target.value)}
        />

        <button
          disabled={!bulletText.trim() || isEditing}
          onClick={addAssistantInformationItemHandler}
          className={` px-32 py-2 rounded ${
            !bulletText.trim() || !bulletOption ? 'disabled' : 'bg-blue-600 text-white'
          }`}
        >
          AGREGAR
        </button>
      </div>
    </div>
  );
};

export default AddBullet;
