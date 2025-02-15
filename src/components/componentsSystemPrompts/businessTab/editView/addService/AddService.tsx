import { useState, useRef, useEffect } from 'react';

// ** Enums
import { bulletOptions } from 'enums/systemPrompts';

// ** Context
import { useBusinessContext } from 'contexts/BusinessProvider';
import { IOptionTextItem, IService, PromptComponentsEnum } from 'types';

// ** Custom hooks
import useServiceFunctions from 'customHooks/services';
import useBulletFunctions from 'customHooks/bullets';

// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

const AddServiceSection = ({ isEditing }: { isEditing: boolean }) => {
  const { tempBusinessServices } = useBusinessContext();

  // ** States para service
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<IOptionTextItem[]>([]);

  // ** States para bullets
  const [bulletOption, setBulletOption] = useState(bulletOptions[0].options[0]);
  const [bulletText, setBulletText] = useState('');
  const [usedOptions, setUsedOptions] = useState<string[]>([]);

  // Guarda la última opción válida para revertir en caso de selección inválida
  const lastValidOption = useRef(bulletOption);

  // ** Hooks
  const { addService } = useServiceFunctions();
  useBulletFunctions(PromptComponentsEnum.BUSINESS);

  // Agrega un nuevo bullet (item) a la lista local
  const addBulletLocal = () => {
    if (!bulletText.trim()) return;
    const nuevoItem = { option: bulletOption, text: bulletText.trim() };
    setItems((prev) => [...prev, nuevoItem]);
    setBulletText('');
  };

  // Verificamos si la opción seleccionada está usada o es inválida; revertimos si lo es
  const handleOptionChange = (newValue: string) => {
    if (usedOptions.includes(newValue) || !newValue) {
      setBulletOption(lastValidOption.current);
      return;
    }
    setBulletOption(newValue);
    lastValidOption.current = newValue;
  };

  // Bloquea las opciones dentro del mismo servicio y selecciona la siguiente opción disponible
  useEffect(() => {
    const usedLocal = items.map((item) => item.option);

    let nextAvailable = '';
    outer: for (const section of bulletOptions) {
      for (const opt of section.options) {
        if (!usedLocal.includes(opt)) {
          nextAvailable = opt;
          break outer;
        }
      }
    }

    setUsedOptions(usedLocal);
    setBulletOption(nextAvailable || '');
    lastValidOption.current = nextAvailable || '';
  }, [items]);

  // Cuando terminamos de cargar todos los datos, agregamos un nuevo service y reseteamos
  const handleAddService = () => {
    if (!title.trim() || !description.trim() || items.length === 0) return;
    addService(title.trim(), description.trim(), items);
    setTitle('');
    setDescription('');
    setItems([]);
  };

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">AGREGAR SERVICIO</h2>

      <div className="space-y-2">
        <input
          disabled={isEditing}
          type="text"
          className={`border rounded px-2 py-2 w-full ${isEditing ? 'disabled' : ''}`}
          placeholder="Ingresar título del servicio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          disabled={isEditing}
          className={`border rounded px-2 py-2 w-full ${isEditing ? 'disabled' : ''}`}
          placeholder="Ingresar descripción del servicio"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

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
          className={`border rounded px-2 py-2 w-full ${isEditing ? 'disabled' : ''}`}
          placeholder="Ingresar descripción del bullet"
          value={bulletText}
          onChange={(e) => setBulletText(e.target.value)}
        />

        <button
          disabled={!bulletText.trim() || isEditing}
          onClick={addBulletLocal}
          className={`button button2 ${(!bulletText.trim() || isEditing) && 'disabled'}`}
        >
          AGREGAR BULLET
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="border p-2 rounded bg-white">
            <p className="text-sm font-bold">Opción: {item.option}</p>
            <p className="text-sm">Texto: {item.text}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          disabled={!title.trim() || !description.trim() || !items.length || isEditing}
          onClick={handleAddService}
          className={`button button2 ${
            (!title.trim() || !description.trim() || !items.length || isEditing) && 'disabled'
          }`}
        >
          AGREGAR SERVICIO
        </button>
      </div>
    </div>
  );
};

export default AddServiceSection;
