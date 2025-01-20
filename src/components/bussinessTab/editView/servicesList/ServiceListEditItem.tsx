// ** React
import { useState } from 'react';

// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

// ** Types
import { IOptionTextItem, IService } from 'types';

// ** Enums
import { serviceOptions } from 'enums/systemPrompts';
import useServices from 'customHooks/company/services';

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
  const [tempTitle, setTempTitle] = useState(service.title);
  const [tempDescription, setTempDescription] = useState(service.description);
  const [tempItems, setTempItems] = useState<IOptionTextItem[]>(service.items || []);
  const [showNoItemsDialog, setShowNoItemsDialog] = useState(false);

  const handleCancelEdit = () => {
    setTempTitle(service.title);
    setTempDescription(service.description);
    setTempItems(service.items);
    setIsEditing(false);
  };

  const handleConfirmEdit = () => {
    const validItems = tempItems.filter((item) => item.option.trim() !== '' && item.text.trim() !== '');

    if (validItems.length === 0) {
      setShowNoItemsDialog(true);
      return;
    }

    setTempCompanyServices((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        title: tempTitle,
        description: tempDescription,
        items: validItems,
      };
      return updated;
    });
    setIsEditing(false);
  };

  const handleAddNewItem = () => {
    setTempItems((prev) => [...prev, { option: '', text: '' }]);
  };

  const handleDeleteItem = (idx: number) => {
    setTempItems((prev) => {
      const updated = [...prev];
      updated.splice(idx, 1);
      return updated;
    });
  };

  const isOptionDisabled = (option: string, currentIndex: number) => {
    return tempItems.some((item, i) => i !== currentIndex && item.option === option);
  };

  const handleConfirmDeleteService = () => {
    deleteService(index);
    setShowNoItemsDialog(false);
  };

  const handleCancelDeleteService = () => {
    setShowNoItemsDialog(false);
    setIsEditing(true);
  };

  const noItemsWarningPopUp = () => {
    return (
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
  };

  return (
    <div
      className="transition-all duration-300 ease-in-out 
        max-h-[600px] overflow-auto
      "
    >
      <div className="pt-[40px]">
        <div className="mb-3">
          <span className="font-semibold block pl-2">Título</span>
          <input
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            className="border rounded h-[40px] px-2 w-full"
          />
        </div>

        <div className="mb-2">
          <span className="font-semibold block  pl-2">Descripción</span>
          <input
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            className="border rounded h-[40px] px-2 w-full"
          />
        </div>

        <div className="mt-3">
          {tempItems.map((item, idx) => (
            <div key={idx} className="mb-4">
              <span className="font-semibold block pl-2">Característica {idx + 1}</span>
              <div className="flex items-center gap-2">
                <select
                  className="border rounded px-2 h-[40px] w-1/3 disabled:bg-gray-200 disabled:text-gray-600"
                  value={item.option}
                  disabled={item.option.trim() !== ''}
                  onChange={(e) => {
                    const newItems = [...tempItems];
                    newItems[idx] = { ...newItems[idx], option: e.target.value };
                    setTempItems(newItems);
                  }}
                >
                  {item.option.trim() === '' && (
                    <option value="" disabled hidden>
                      Seleccione una opción
                    </option>
                  )}
                  {serviceOptions.map((section) => (
                    <optgroup key={uuidv4()} label={section.label}>
                      {section.options.map((opt) => (
                        <option
                          key={uuidv4()}
                          value={opt}
                          disabled={isOptionDisabled(opt, idx)}
                          style={{
                            color: isOptionDisabled(opt, idx) ? 'rgba(75, 85, 99, 0.7)' : 'black',
                            backgroundColor: isOptionDisabled(opt, idx) ? '#E5E7EB' : 'transparent',
                          }}
                        >
                          {opt}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <input
                  className="border rounded h-[40px] px-2 flex-grow"
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...tempItems];
                    newItems[idx] = { ...newItems[idx], text: e.target.value };
                    setTempItems(newItems);
                  }}
                />

                <button
                  onClick={() => handleDeleteItem(idx)}
                  className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center rounded justify-center text-white"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <button onClick={handleAddNewItem} className="bg-blue-500 text-white px-3 py-2 rounded">
              Agregar característica
            </button>

            <div className="flex gap-2">
              <button onClick={handleCancelEdit} className="bg-red-600 text-white w-[40px] h-[40px] rounded">
                ✕
              </button>
              <button
                onClick={handleConfirmEdit}
                className="bg-green-700 text-white  w-[40px] h-[40px] rounded"
              >
                ✓
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
