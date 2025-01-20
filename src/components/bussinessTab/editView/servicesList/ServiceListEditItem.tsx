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

// ** Custom hooks
import useServices from 'customHooks/company/services';

interface ILocalItem extends IOptionTextItem {
  isNew: boolean;
  originalText?: string;
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

  // ** States
  const [showNoItemsDialog, setShowNoItemsDialog] = useState(false);

  // Guardamos el título y descripción originales para detectar cambios
  const [originalTitle, setOriginalTitle] = useState(service.title);
  const [originalDescription, setOriginalDescription] = useState(service.description);

  const [tempTitle, setTempTitle] = useState(service.title);
  const [tempDescription, setTempDescription] = useState(service.description);

  // Guardamos 'originalText' para cada ítem existente y así detectar cambios
  const [tempItems, setTempItems] = useState<ILocalItem[]>(
    (service.items || []).map((item) => ({
      ...item,
      isNew: false,
      originalText: item.text,
    })),
  );

  // Detecta si el título cambió
  const hasTitleChanges = tempTitle !== originalTitle;

  // Detecta si la descripción cambió
  const hasDescriptionChanges = tempDescription !== originalDescription;

  // Restaura valores iniciales
  const handleCancelEdit = () => {
    setTempTitle(service.title);
    setTempDescription(service.description);
    setTempItems(
      (service.items || []).map((item) => ({
        ...item,
        isNew: false,
        originalText: item.text,
      })),
    );
    setOriginalTitle(service.title);
    setOriginalDescription(service.description);
    setIsEditing(false);
  };

  // Confirmación final del formulario
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
        items: validItems.map(({ isNew, originalText, ...rest }) => rest),
      };
      return updated;
    });

    setIsEditing(false);
  };

  // Añade nueva característica
  const handleAddNewItem = () => {
    setTempItems((prev) => [
      ...prev,
      {
        option: '',
        text: '',
        isNew: true,
      },
    ]);
  };

  // Elimina ítem
  const handleDeleteItem = (idx: number) => {
    setTempItems((prev) => {
      const updated = [...prev];
      updated.splice(idx, 1);
      return updated;
    });
  };

  // Confirma un ítem recién creado
  const handleConfirmNewItem = (idx: number) => {
    setTempItems((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        isNew: false,
        originalText: updated[idx].text,
      };
      return updated;
    });
  };

  // Confirma edición de un ítem existente (texto)
  const handleConfirmEditItemChange = (idx: number) => {
    setTempItems((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        originalText: updated[idx].text,
      };
      return updated;
    });
  };

  // Cancela edición de un ítem existente (texto)
  const handleCancelEditItemChange = (idx: number) => {
    setTempItems((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        text: updated[idx].originalText || '',
      };
      return updated;
    });
  };

  // Confirma edición de título
  const handleConfirmTitleChange = () => {
    setOriginalTitle(tempTitle);
  };

  // Cancela edición de título
  const handleCancelTitleChange = () => {
    setTempTitle(originalTitle);
  };

  // Confirma edición de descripción
  const handleConfirmDescriptionChange = () => {
    setOriginalDescription(tempDescription);
  };

  // Cancela edición de descripción
  const handleCancelDescriptionChange = () => {
    setTempDescription(originalDescription);
  };

  // Deshabilita opciones repetidas
  const isOptionDisabled = (option: string, currentIndex: number) => {
    return tempItems.some((item, i) => i !== currentIndex && item.option === option);
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

  return (
    <div className="transition-all duration-300 ease-in-out max-h-[600px] overflow-auto">
      <div className="pt-[40px]">
        {/* Título */}
        <div className="mb-3">
          <span className="font-semibold block pl-2">Título</span>
          <div className="flex gap-2">
            <input
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="border rounded h-[40px] px-2 w-full"
            />
            {hasTitleChanges && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelTitleChange}
                  className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
                >
                  ✕
                </button>
                <button
                  onClick={handleConfirmTitleChange}
                  disabled={tempTitle.trim() === ''}
                  className="bg-green-700 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  ✓
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-2">
          <span className="font-semibold block pl-2">Descripción</span>
          <div className="flex gap-2">
            <input
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              className="border rounded h-[40px] px-2 w-full"
            />
            {hasDescriptionChanges && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelDescriptionChange}
                  className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
                >
                  ✕
                </button>
                <button
                  onClick={handleConfirmDescriptionChange}
                  disabled={tempDescription.trim() === ''}
                  className="bg-green-700 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  ✓
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <span className="font-semibold block pl-2 mb-1">Características:</span>

          {tempItems.map((item, idx) => {
            const hasChanges = !item.isNew && item.text !== item.originalText;

            return (
              <div key={idx} className="mb-4">
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded px-2 h-[40px] w-1/3 disabled:bg-gray-200 disabled:text-gray-600 pr-8"
                    value={item.option}
                    disabled={item.option.trim() !== ''}
                    onChange={(e) => {
                      const newItems = [...tempItems];
                      newItems[idx] = {
                        ...newItems[idx],
                        option: e.target.value,
                      };
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
                      const newValue = e.target.value;
                      setTempItems((prev) => {
                        const updated = [...prev];
                        updated[idx] = {
                          ...updated[idx],
                          text: newValue,
                        };
                        return updated;
                      });
                    }}
                  />

                  {item.isNew ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteItem(idx)}
                        className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => handleConfirmNewItem(idx)}
                        disabled={item.option.trim() === '' || item.text.trim() === ''}
                        className="bg-green-700 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        ✓
                      </button>
                    </div>
                  ) : hasChanges ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancelEditItemChange(idx)}
                        className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => handleConfirmEditItemChange(idx)}
                        disabled={item.text.trim() === ''}
                        className="bg-green-700 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDeleteItem(idx)}
                      className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <button onClick={handleAddNewItem} className="bg-blue-600 text-white px-3 py-2 rounded mt-2">
            Agregar característica
          </button>

          <div className="h-[1px] border border-gray-400 mt-6"></div>

          <div className="flex justify-end items-center mt-6">
            <div className="flex gap-2">
              <button onClick={handleCancelEdit} className="bg-red-600 text-white h-[40px] px-3 rounded">
                Cancelar
              </button>
              <button onClick={handleConfirmEdit} className="bg-green-700 text-white h-[40px] px-3 rounded">
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
