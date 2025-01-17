// SystemPromptEditViewContainer.tsx
import { useEffect, useState } from 'react';
import { bulletOptions, serviceOptions, useSystemPromptContext } from 'contexts/SystemPromptProvider';
import SystemPromptEditViewListBullet from './SystemPromptEditViewOrderList';
import SystemPromptEditViewListService from './SystemPromptEditViewListService';
import { v4 as uuidv4 } from 'uuid';
import SystemPromptEditViewOrderList from './SystemPromptEditViewOrderList';

export type OrderedListType = { text: string; type: 'bullet' } | { type: 'service' } | { type: 'noData' };

const SystemPromptEditViewContainer = () => {
  const {
    // -- Bullets (ya existentes en el contexto) --

    tempBullets,
    systemPromptToEdit,
    tempServices,
    addBullet,
    addService,
    handleSave,
    handleCancel,
  } = useSystemPromptContext();

  //ORDERED LIST
  const [orderedList, setOrderedList] = useState<OrderedListType[]>([]);
  const [servicesOrderIndex, setServicesOrderIndex] = useState<number>(
    systemPromptToEdit?.servicesOrderIndex || 0,
  );

  // BULLETS
  const [bulletOption, setBulletOption] = useState(bulletOptions[0].options[0]);
  const [bulletText, setBulletText] = useState('');

  // SERVICES
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceOption, setServiceOption] = useState(serviceOptions[0].options[0]);
  const [serviceText, setServiceText] = useState('');

  // Aquí guardamos lo que el usuario vaya agregando al servicio
  const [serviceItems, setServiceItems] = useState<{ option: string; text: string }[]>([]);

  const addBulletHandler = () => {
    if (!bulletText.trim()) return;
    addBullet(bulletOption, bulletText);
    setBulletText('');
  };

  // ----------------------- HANDLERS PARA SERVICIOS -----------------------
  // Agregar un ítem (option + text) al array local de "serviceItems"
  const handleAddServiceItemSegment = () => {
    if (!serviceText.trim()) return;
    setServiceItems((prev) => [
      ...prev,
      {
        option: serviceOption.trim(),
        text: serviceText.trim(),
      },
    ]);
    // Reiniciamos el input
    setServiceOption(serviceOptions[0].options[0]);
    setServiceText('');
  };

  // Crear el servicio final y pasarlo al contexto
  const handleFinishService = () => {
    if (!serviceTitle.trim() || !serviceDescription.trim() || serviceItems.length === 0) return;

    // Estructura que el contexto espera para servicios
    const newService = {
      title: serviceTitle.trim(),
      description: serviceDescription.trim(),
      items: serviceItems,
      fullChain:
        `Titulo del servicio: ${serviceTitle.trim()}. ` +
        `Descripcion del servicio: ${serviceDescription.trim()}. ` +
        'Caracteristicas del servicio: ' +
        serviceItems.map((it) => `${it.option} ${it.text}. `).join('\n'),
    };

    // Usar la función del contexto para agregar el servicio a tempServices
    addService(newService);

    // Limpiar campos locales
    setServiceTitle('');
    setServiceDescription('');
    setServiceItems([]);
  };

  const saveHandler = () => {
    handleSave(servicesOrderIndex);
  };

  useEffect(() => {
    if (tempBullets.length === 0 && tempServices.length === 0) {
      setOrderedList([
        {
          type: 'noData' as unknown as 'noData',
        },
      ]);
      return;
    }

    if (tempBullets.length === 0 && tempServices.length > 0) {
      setOrderedList([
        {
          type: 'service' as unknown as 'service',
        },
      ]);
      return;
    }

    if (tempBullets.length > 0 && tempServices.length === 0) {
      setOrderedList([
        ...tempBullets.map((item) => ({
          text: item,
          type: 'bullet' as unknown as 'bullet',
        })),
      ]);
      return;
    }

    if (tempBullets.length > 0 && tempServices.length > 0) {
      const orderedListToPush = [
        ...tempBullets
          .map((item) => ({
            text: item,
            type: 'bullet' as unknown as 'bullet',
          }))
          .slice(0, servicesOrderIndex), // Bullets antes del servicio
        { type: 'service' as unknown as 'service' },
        ...tempBullets
          .map((item) => ({
            text: item,
            type: 'bullet' as unknown as 'bullet',
          }))
          .slice(servicesOrderIndex), // Bullets después del servicio
      ];

      setOrderedList(orderedListToPush);
      return;
    }

    console.log(
      'tempBullets',
      tempBullets,
      'tempServices',
      tempServices,
      'servicesOrderIndex',
      servicesOrderIndex,
    );
  }, [tempBullets, tempServices, servicesOrderIndex]);

  useEffect(() => {
    console.log('ORDERED LIST', orderedList);
  }, [orderedList]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">MODIFICAR SYSTEM PROMPT</h1>
      <div className="space-y-2">
        <label className="block text-xl font-semibold text-center text-gray-700">
          Modificando: {systemPromptToEdit?.title}
        </label>
      </div>

      {/* ---------------------- SECCIÓN: Agregar BULLET ---------------------- */}
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

          <button onClick={addBulletHandler} className="bg-green-500 text-white px-32 py-2 rounded">
            Agregar
          </button>
        </div>
      </div>

      {/* ---------------------- SECCIÓN: Agregar SERVICIO ---------------------- */}
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

            <button
              onClick={handleAddServiceItemSegment}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
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
          <button onClick={handleFinishService} className="bg-blue-500 text-white px-6 py-2 rounded">
            Finalizar Servicio
          </button>
        </div>
      </div>

      {/* ---------------------- LISTADO: SERVICIOS ---------------------- */}
      <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
        <h2 className="font-semibold text-center">Servicios</h2>
        {tempServices.length === 0 && (
          <div className="flex w-full justify-center">No hay servicios agregados</div>
        )}

        <div className="space-y-2">
          {tempServices.map((srv, idx) => (
            <SystemPromptEditViewListService
              key={uuidv4()}
              service={{
                title: srv.title,
                description: srv.description,
                requirements: srv.items.map((it) => `${it.option} ${it.text}`),
              }}
              index={idx}
              length={tempServices.length}
              // Usando las funciones del contexto en el componente para mover/borrar
            />
          ))}
        </div>
      </div>

      {/* ---------------------- LISTADO: BULLETS ---------------------- */}
      <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
        <h2 className="font-semibold text-center">Ordenamiento</h2>

        <div className="space-y-2">
          {orderedList.map((item, index) => {
            const bulletIndex = index < servicesOrderIndex ? index : index - 1;

            return (
              <SystemPromptEditViewOrderList
                key={uuidv4()}
                data={item}
                setServicesOrderIndex={setServicesOrderIndex}
                servicesOrderIndex={servicesOrderIndex}
                index={index}
                bulletIndex={bulletIndex}
                bulletslength={tempBullets.length}
                dataLength={tempBullets.length}
              />
            );
          })}
        </div>
      </div>

      {/* ---------------------- BOTONES FINALES ---------------------- */}
      <div className="flex justify-end gap-4">
        <button onClick={saveHandler} className="bg-blue-600 text-white px-6 py-2 rounded">
          Guardar
        </button>
        <button onClick={handleCancel} className="bg-gray-300 text-black px-6 py-2 rounded">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SystemPromptEditViewContainer;
