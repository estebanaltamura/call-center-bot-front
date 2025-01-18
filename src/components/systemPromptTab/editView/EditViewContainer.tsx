// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useSystemPromptContext } from 'contexts/SystemPromptsProvider';

// ** 3rd party
import { v4 as uuidv4 } from 'uuid';

// ** Enums
import { bulletOptions, serviceOptions } from 'enums/systemPrompts';

// ** Types
import { OrderedListType } from 'types';
import AddBullet from './addBullet/AddBullet';
import AddService from './addService/AddService';
import ServicesList from './servicesList/ServicesList';
import OrderedList from './orderedList/OrderedList';

const EditViewContainer = () => {
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

      <AddBullet
        addBulletHandler={addBulletHandler}
        bulletOption={bulletOption}
        setBulletOption={setBulletOption}
        bulletText={bulletText}
        setBulletText={setBulletText}
      />

      <AddService
        handleAddServiceItemSegment={handleAddServiceItemSegment}
        handleFinishService={handleFinishService}
        serviceItems={serviceItems}
        serviceOption={serviceOption}
        setServiceOption={setServiceOption}
        serviceText={serviceText}
        setServiceText={setServiceText}
        serviceTitle={serviceTitle}
        setServiceTitle={setServiceTitle}
        serviceDescription={serviceDescription}
        setServiceDescription={setServiceDescription}
      />

      <ServicesList tempServices={tempServices} />

      {/* ---------------------- LISTADO: Ordenar listado ---------------------- */}
      <OrderedList
        orderedList={orderedList}
        servicesOrderIndex={servicesOrderIndex}
        setServicesOrderIndex={setServicesOrderIndex}
        tempBullets={tempBullets}
      />

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

export default EditViewContainer;
