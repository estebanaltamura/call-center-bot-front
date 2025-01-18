// ** React
import { createContext, useContext, useEffect, useState } from 'react';

// ** Context original (sigue usando la data que ya existe en SystemPromptsProvider)
import { useSystemPromptContext } from 'contexts/SystemPromptsProvider';

// ** 3rd party
import { v4 as uuidv4 } from 'uuid';

// ** Enums
import { bulletOptions, serviceOptions } from 'enums/systemPrompts';

// ** Types
import { OrderedListType } from 'types';

// ** Componentes hijos (que ya no reciben props, sino que consumirán contexto)
import AddBullet from './addBullet/AddBullet';
import AddService from './addService/AddService';
import ServicesList from './servicesList/ServicesList';
import OrderedList from './orderedList/OrderedList';
import { ISystemPromptEntity } from 'types/dynamicSevicesTypes';

/* ------------------------------------------------------------------
   Creamos el nuevo contexto para encapsular todos los estados y 
   funciones, de modo que los componentes hijos no reciban props 
   sino que consuman desde este contexto.
------------------------------------------------------------------ */

interface EditViewContextType {
  bulletOption: string;
  setBulletOption: React.Dispatch<React.SetStateAction<string>>;
  bulletText: string;
  setBulletText: React.Dispatch<React.SetStateAction<string>>;
  serviceTitle: string;
  setServiceTitle: React.Dispatch<React.SetStateAction<string>>;
  serviceDescription: string;
  setServiceDescription: React.Dispatch<React.SetStateAction<string>>;
  serviceOption: string;
  setServiceOption: React.Dispatch<React.SetStateAction<string>>;
  serviceText: string;
  setServiceText: React.Dispatch<React.SetStateAction<string>>;
  serviceItems: { option: string; text: string }[];
  handleAddServiceItemSegment: () => void;
  handleFinishService: () => void;
  tempServices: any[];
  orderedList: any[];
  setOrderedList: React.Dispatch<React.SetStateAction<any[]>>;
  servicesOrderIndex: number;
  setServicesOrderIndex: React.Dispatch<React.SetStateAction<number>>;
  tempBullets: string[];
  saveHandler: () => void;
  handleCancel: () => void;
  addBulletHandler: () => void;
  systemPromptToEdit: ISystemPromptEntity | null;
}

// 2) Cambiá la creación del contexto a:
const EditViewContext = createContext({} as EditViewContextType);

export const useEditViewContext = () => useContext(EditViewContext);

const EditViewContainer = () => {
  // ----------------------------------------------------------------
  // Estados y funciones que vienen del contexto original
  // (SystemPromptsProvider). No se los pasamos por props a los hijos,
  // sino que los pondremos en el nuevo contexto EditViewContext.
  // ----------------------------------------------------------------
  const { tempBullets, systemPromptToEdit, tempServices, addBullet, addService, handleSave, handleCancel } =
    useSystemPromptContext();

  // ----------------------------------------------------------------
  // ---------------------- ESTADOS GENERALES ------------------------
  // ----------------------------------------------------------------

  // Ordered List
  const [orderedList, setOrderedList] = useState<OrderedListType[]>([]);
  const [servicesOrderIndex, setServicesOrderIndex] = useState<number>(
    systemPromptToEdit?.servicesOrderIndex || 0,
  );

  // Bullets
  const [bulletOption, setBulletOption] = useState(bulletOptions[0].options[0]);
  const [bulletText, setBulletText] = useState('');

  // Services
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceOption, setServiceOption] = useState(serviceOptions[0].options[0]);
  const [serviceText, setServiceText] = useState('');
  const [serviceItems, setServiceItems] = useState<{ option: string; text: string }[]>([]);

  // ----------------------------------------------------------------
  // --------------------- FUNCIONES DE BULLETS ---------------------
  // ----------------------------------------------------------------
  const addBulletHandler = () => {
    if (!bulletText.trim()) return;
    addBullet(bulletOption, bulletText);
    setBulletText('');
  };

  // ----------------------------------------------------------------
  // ------------------- FUNCIONES DE SERVICIOS ---------------------
  // ----------------------------------------------------------------
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
      fullChain:
        `Titulo del servicio: ${serviceTitle.trim()}. ` +
        `Descripcion del servicio: ${serviceDescription.trim()}. ` +
        'Caracteristicas del servicio: ' +
        serviceItems.map((it) => `${it.option} ${it.text}. `).join('\n'),
    };
    addService(newService);
    setServiceTitle('');
    setServiceDescription('');
    setServiceItems([]);
  };

  // ----------------------------------------------------------------
  // --------------------- GUARDAR / CANCELAR -----------------------
  // ----------------------------------------------------------------
  const saveHandler = () => {
    handleSave(servicesOrderIndex);
  };

  // ----------------------------------------------------------------
  // ---------- EFECTOS PARA ARMAR EL ORDEN SEGÚN BULLETS -----------
  // ----------------------------------------------------------------
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
          .slice(0, servicesOrderIndex),
        { type: 'service' as unknown as 'service' },
        ...tempBullets
          .map((item) => ({
            text: item,
            type: 'bullet' as unknown as 'bullet',
          }))
          .slice(servicesOrderIndex),
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

  // ----------------------------------------------------------------
  // Construimos el value del contexto, definiendo qué usarán
  // los distintos componentes, separado por comentarios.
  // ----------------------------------------------------------------
  const contextValue = {
    // ----------------------------------------------------------------
    // ESTADOS Y FUNCIONES PARA AddBullet
    // ----------------------------------------------------------------
    bulletOption,
    setBulletOption,
    bulletText,
    setBulletText,
    addBulletHandler,

    // ----------------------------------------------------------------
    // ESTADOS Y FUNCIONES PARA AddService
    // ----------------------------------------------------------------
    serviceTitle,
    setServiceTitle,
    serviceDescription,
    setServiceDescription,
    serviceOption,
    setServiceOption,
    serviceText,
    setServiceText,
    serviceItems,
    handleAddServiceItemSegment,
    handleFinishService,

    // ----------------------------------------------------------------
    // ESTADOS Y FUNCIONES PARA ServicesList
    // ----------------------------------------------------------------
    tempServices,

    // ----------------------------------------------------------------
    // ESTADOS Y FUNCIONES PARA OrderedList
    // ----------------------------------------------------------------
    orderedList,
    setOrderedList,
    servicesOrderIndex,
    setServicesOrderIndex,
    tempBullets,

    // ----------------------------------------------------------------
    // ESTADOS Y FUNCIONES DE BOTONES FINALES
    // ----------------------------------------------------------------
    saveHandler,
    handleCancel,

    // ----------------------------------------------------------------
    // Dato de referencia para título u otro que necesiten
    // ----------------------------------------------------------------
    systemPromptToEdit,
  };

  return (
    <EditViewContext.Provider value={contextValue}>
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold text-center">MODIFICAR SYSTEM PROMPT</h1>
        <div className="space-y-2">
          <label className="block text-xl font-semibold text-center text-gray-700">
            Modificando: {systemPromptToEdit?.title}
          </label>
        </div>

        {/* Ya no pasamos props a los hijos, pues usarán nuestro contexto */}
        <AddBullet />
        <AddService />
        <OrderedList />

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
    </EditViewContext.Provider>
  );
};

export default EditViewContainer;
