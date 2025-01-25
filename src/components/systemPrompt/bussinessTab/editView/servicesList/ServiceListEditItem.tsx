// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

// ** Types
import { IOptionTextItem, IService } from 'types';

// ** Enums
import { serviceOptions } from 'enums/systemPrompts';

// ** Custom hooks
import useServices from 'customHooks/company/services';

// ** Components
import FormInputField from 'components/general/FormInputField';
import FormSelectFieldList from 'components/general/FormSelectFieldList';

interface ILocalItem extends IOptionTextItem {
  id: string;
  isNew: boolean;
  isEditing: boolean;
  originalText: string;
}

const ServiceListEditItem = ({
  service,
  setIsEditing,
  index,
}: {
  index: number;
  service: IService;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { deleteService } = useServices();
  const { setTempCompanyServices } = useCompanyContext();

  // ** Editing states
  const [isThereAnEditingItem, setIsThereAnEditingItem] = useState(false);
  const [isTitleChanging, setIsTitleChanging] = useState(false);
  const [isDescriptionChanging, setIsDescriptionChanging] = useState(false);

  // ** States
  const [showNoItemsDialog, setShowNoItemsDialog] = useState(false);

  // Guardamos el título y descripción para restaurar en caso de cancelar
  const [tempTitle, setTempTitle] = useState({ originalText: service.title, text: service.title });
  const [tempDescription, setTempDescription] = useState({
    originalText: service.description,
    text: service.description,
  });

  // Creamos el estado local de items, cada uno con un id y flags
  const [tempItems, setTempItems] = useState<ILocalItem[]>(
    (service.items || []).map((item) => ({
      id: uuidv4(),
      option: item.option,
      text: item.text,
      originalText: item.text,
      isNew: false,
      isEditing: false,
    })),
  );

  // Restaura valores iniciales
  const handleCancelEdit = () => {
    setTempTitle({ originalText: service.title, text: service.title });
    setTempDescription({ originalText: service.description, text: service.description });

    setTempItems(
      (service.items || []).map((item) => ({
        id: uuidv4(),
        option: item.option,
        text: item.text,
        originalText: item.text,
        isNew: false,
        isEditing: false,
      })),
    );

    setIsEditing(false);
  };

  // Confirmación final del formulario
  const handleConfirmEdit = () => {
    // Validamos que haya al menos un item con texto y opción
    const validItems = tempItems.filter((item) => item.option.trim() !== '' && item.text.trim() !== '');

    if (validItems.length === 0) {
      setShowNoItemsDialog(true);
      return;
    }

    // Actualizamos en el contexto global
    setTempCompanyServices((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        title: tempTitle.text,
        description: tempDescription.text,
        // Quitamos las props internas (id, isEditing, isNew, originalText) para guardarlo limpio
        items: validItems.map(({ id, isEditing, isNew, originalText, ...rest }) => rest),
      };
      return updated;
    });

    setIsEditing(false);
  };

  // Diálogo al no tener items
  const handleConfirmDeleteService = () => {
    deleteService(index);
    setShowNoItemsDialog(false);
  };

  const handleCancelDeleteService = () => {
    setShowNoItemsDialog(false);
    setIsEditing(true);
  };

  // Pop-up de advertencia al no tener items
  const noItemsWarningPopUp = () => (
    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white border p-4 rounded shadow-md w-[300px] flex flex-col items-center">
        <p className="mb-4 text-center">
          No se puede guardar un servicio sin ninguna característica. <br />
          ¿Deseas borrar este servicio?
        </p>
        <div className="flex gap-4">
          <button onClick={handleConfirmDeleteService} className="bg-red-600 text-white px-3 py-1 rounded">
            Aceptar
          </button>
          <button onClick={handleCancelDeleteService} className="bg-gray-200 text-black px-3 py-1 rounded">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    setIsThereAnEditingItem(tempItems.some((item) => item.isEditing));
  }, [tempItems]);

  useEffect(() => {
    const titleIsChanging = tempTitle.originalText !== tempTitle.text;
    const descriptionIsChanging = tempDescription.originalText !== tempDescription.text;

    setIsTitleChanging(titleIsChanging);
    setIsDescriptionChanging(descriptionIsChanging);
  }, [tempTitle, tempDescription]);

  return (
    <div className="transition-all duration-300 ease-in-out max-h-[600px] overflow-auto">
      <div className="pt-[40px]">
        {/* Título */}
        <FormInputField
          label="Título"
          placeholder="Ingresá un título"
          originalValue={tempTitle}
          setOriginialValue={setTempTitle}
          disabled={isThereAnEditingItem || isDescriptionChanging}
        />

        {/* Descripción */}
        <FormInputField
          label="Descripción"
          placeholder="Ingresá una descripción"
          originalValue={tempDescription}
          setOriginialValue={setTempDescription}
          disabled={isThereAnEditingItem || isTitleChanging}
        />

        <div className="mt-3">
          <span className="font-semibold block pl-2 mb-1">Características:</span>

          {/* Acá usamos el nuevo FormSelectFieldList que maneja los items con id/isEditing/isNew */}
          <FormSelectFieldList
            originalItems={tempItems}
            setOriginalItems={setTempItems}
            isThereAnEditingItem={isThereAnEditingItem || isTitleChanging || isDescriptionChanging}
          />

          <div className="h-[1px] border border-gray-400 mt-6"></div>

          <div className="flex justify-end items-center mt-6">
            <div className="flex gap-2">
              <button
                disabled={isThereAnEditingItem || isTitleChanging || isDescriptionChanging}
                onClick={handleCancelEdit}
                className={`bg-red-600 text-white h-[40px] px-3 rounded ${
                  (isThereAnEditingItem || isTitleChanging || isDescriptionChanging) &&
                  'bg-[#E5E7EB] text-[#4b5563] opacity-70 cursor-not-allowed'
                }`}
              >
                Cancelar
              </button>
              <button
                disabled={isThereAnEditingItem || isTitleChanging || isDescriptionChanging}
                onClick={handleConfirmEdit}
                className={`bg-green-700 text-white h-[40px] px-3 rounded ${
                  (isThereAnEditingItem || isTitleChanging || isDescriptionChanging) &&
                  'bg-[#E5E7EB] text-[#4b5563] opacity-70 cursor-not-allowed'
                }`}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNoItemsDialog && noItemsWarningPopUp()}
    </div>
  );
};

export default ServiceListEditItem;
