import { useState, useRef, useEffect } from 'react';

// ** Enums
import { bulletOptions } from 'enums/systemPrompts';

// ** Context
import { useBusinessContext } from 'contexts/BusinessProvider';
import { IOptionTextItem, IService } from 'types';

// ** Custom hooks
import useServiceFunctions from 'customHooks/services';
import useBulletFunctions, { PromptComponentsEnum } from 'customHooks/bullets';

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
  useBulletFunctions(PromptComponentsEnum.BUSINESS); // Por si necesitás otras funciones

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

  // Calcula las opciones usadas combinando las de todos los services existentes y las del local
  useEffect(() => {
    const usedFromServices = tempBusinessServices.flatMap((service: IService) =>
      service.items.map((item) => item.option),
    );
    const usedLocal = items.map((item) => item.option);
    const allUsed = [...usedFromServices, ...usedLocal];

    let nextAvailable = '';
    outer: for (const section of bulletOptions) {
      for (const opt of section.options) {
        if (!allUsed.includes(opt)) {
          nextAvailable = opt;
          break outer;
        }
      }
    }

    setUsedOptions(allUsed);
    setBulletOption(nextAvailable || '');
    lastValidOption.current = nextAvailable || '';
  }, [tempBusinessServices, items]);

  // Cuando terminamos de cargar todos los datos, agregamos un nuevo service
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
            <optgroup key={section.label} label={section.label}>
              {section.options.map((opt) => {
                const isUsed = usedOptions.includes(opt);
                return (
                  <option
                    key={opt}
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

      {/* Listado de bullets que se van agregando antes de crear el servicio */}
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
