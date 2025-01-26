// ** React
import { useState } from 'react';

// ** Enums
import { serviceOptions } from 'enums/systemPrompts';

// ** Custom hooks
import useServices from 'customHooks/services';

// ** 3rd party
import { v4 as uuidv4 } from 'uuid';

const AddService = () => {
  const { addService } = useServices();
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceOption, setServiceOption] = useState(serviceOptions[0].options[0]);
  const [serviceText, setServiceText] = useState('');
  const [serviceItems, setServiceItems] = useState<{ option: string; text: string }[]>([]);

  const handleAddServiceItemSegment = () => {
    if (!serviceText.trim()) return;
    setServiceItems((prev) => [
      ...prev,
      {
        option: serviceOption.trim(),
        text: serviceText.trim(),
      },
    ]);
    setServiceOption(serviceOptions[0].options[0]);
    setServiceText('');
  };

  const handleFinishService = () => {
    if (!serviceTitle.trim() || !serviceDescription.trim() || serviceItems.length === 0) return;
    const newService = {
      title: serviceTitle.trim(),
      description: serviceDescription.trim(),
      items: serviceItems,
    };
    addService(newService);
    setServiceTitle('');
    setServiceDescription('');
    setServiceItems([]);
  };

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">Agregar servicio</h2>

      {/* Título y descripción principal del servicio */}
      <input
        type="text"
        className="border rounded px-2 py-2 w-full"
        placeholder="Título del servicio"
        value={serviceTitle}
        onChange={(e) => setServiceTitle(e.target.value)}
      />
      <input
        type="text"
        className="border rounded px-2 py-2 w-full"
        placeholder="Descripción del servicio"
        value={serviceDescription}
        onChange={(e) => setServiceDescription(e.target.value)}
      />

      {/* Agregar ítems (option + text) al servicio */}
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <select
            className="border rounded px-2 py-2 w-1/2"
            value={serviceOption}
            onChange={(e) => setServiceOption(e.target.value)}
          >
            {serviceOptions.map((section) => (
              <optgroup key={uuidv4()} label={section.label}>
                {section.options.map((opt) => (
                  <option key={uuidv4()} value={opt}>
                    {opt}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <input
            type="text"
            className="border rounded px-2 py-2 w-full"
            placeholder="Detalle para esta opción"
            value={serviceText}
            onChange={(e) => setServiceText(e.target.value)}
          />

          <button onClick={handleAddServiceItemSegment} className="bg-green-500 text-white px-4 py-2 rounded">
            +
          </button>
        </div>

        {/* Listado de segmentos agregados a este servicio antes de finalizar */}
        {serviceItems.length > 0 && (
          <div className="bg-white border rounded p-2">
            <h4 className="font-semibold mb-2">Items del servicio:</h4>
            <ul className="list-disc list-inside space-y-1">
              {serviceItems.map((item) => (
                <li key={uuidv4()}>
                  <strong>{item.option}</strong>: {item.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Botón para crear el servicio */}
      <div className="flex justify-center">
        <button onClick={handleFinishService} className="bg-blue-600 text-white px-6 py-2 rounded">
          Finalizar Servicio
        </button>
      </div>
    </div>
  );
};

export default AddService;
