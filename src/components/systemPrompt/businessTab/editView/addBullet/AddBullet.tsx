// ** React
import { useState, useRef, useEffect } from 'react';

// ** Custom hooks
import { PromptComponentsEnum } from 'customHooks/bullets';
import useBulletFunctions from 'customHooks/bullets';

// ** Contexts
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** Enums
import { bulletOptions } from 'enums/systemPrompts';

// ** 3rd party
import { v4 as uuidv4 } from 'uuid';
import { DefinedContextEnum, useDataContext } from 'contexts/DataContextProvider';

const AddBulletSection = ({ isEditing }: { isEditing: boolean }) => {
  // ** States
  const [bulletOption, setBulletOption] = useState(bulletOptions[0].options[0]);
  const [bulletText, setBulletText] = useState('');
  const [usedOptions, setUsedOptions] = useState<string[]>([]);

  // Contexts
  const { addBullet } = useBulletFunctions(PromptComponentsEnum.BUSINESS);
  const { tempBullets } = useDataContext(DefinedContextEnum.BUSINESSES);

  // Guarda la última opción válida para revertir en caso de selección inválida
  const lastValidOption = useRef(bulletOption);

  // Agregar bullet
  const addBusinessBulletHandler = () => {
    addBullet(bulletOption, bulletText);
    setBulletText('');
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
    const updatedUsed = tempBusinessData.map((item) => item.option);

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

    setUsedOptions(updatedUsed);
    setBulletOption(nextAvailable);
    lastValidOption.current = nextAvailable;
  }, [tempBusinessData]);

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
          onClick={addBusinessBulletHandler}
          className={`button button2 ${(!bulletText.trim() || !bulletOption || isEditing) && 'disabled'}`}
        >
          AGREGAR
        </button>
      </div>
    </div>
  );
};

export default AddBulletSection;
