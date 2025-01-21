import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { serviceOptions } from 'enums/systemPrompts';
import { IOptionTextItem } from 'types';

interface ILocalItem extends IOptionTextItem {
  id: string;
  originalText: string;
  isEditing: boolean;
  isNew: boolean;
}

export default function FormSelectFieldList({
  originalItems,
  setOriginalItems,
  isThereAnEditingItem,
}: {
  originalItems: ILocalItem[];
  setOriginalItems: React.Dispatch<React.SetStateAction<ILocalItem[]>>;
  isThereAnEditingItem: boolean;
}) {
  const iniciarEdicion = (id: string) => {
    setOriginalItems((prev) =>
      prev.map((item) => {
        // Solo permite iniciar edición si no hay otro item en edición
        if (!isThereAnEditingItem || item.isEditing) {
          if (item.id === id) {
            return {
              ...item,
              isEditing: true,
            };
          }
        }
        return { ...item, isEditing: false };
      }),
    );
  };

  const cambiarTexto = (id: string, nuevoTexto: string) => {
    setOriginalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            text: nuevoTexto,
          };
        }
        return item;
      }),
    );
  };

  const cambiarOpcion = (id: string, nuevaOpcion: string) => {
    setOriginalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            option: nuevaOpcion,
          };
        }
        return item;
      }),
    );
  };

  const eliminarItem = (id: string) => {
    setOriginalItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cancelarItemNuevo = (id: string) => {
    eliminarItem(id);
  };

  const confirmarItemNuevo = (id: string) => {
    setOriginalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isNew: false,
            isEditing: false,
            originalText: item.text,
          };
        }
        return item;
      }),
    );
  };

  const cancelarEdicion = (id: string) => {
    setOriginalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            text: item.originalText,
            isEditing: false,
          };
        }
        return item;
      }),
    );
  };

  const confirmarEdicion = (id: string) => {
    setOriginalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            originalText: item.text,
            isEditing: false,
          };
        }
        return item;
      }),
    );
  };

  const opcionDeshabilitada = (opcion: string, selfId: string) => {
    return originalItems.some((item) => item.id !== selfId && item.option === opcion);
  };

  const itemCambiado = (item: ILocalItem) => {
    if (item.isNew) return false;
    return item.text !== (item.originalText || '');
  };

  // Agrega un nuevo item vacío en modo edición
  const handleAddNewItem = () => {
    setOriginalItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        option: '',
        text: '',
        originalText: '',
        isNew: true,
        isEditing: true,
      },
    ]);
  };

  return (
    <div>
      {originalItems.map((item) => {
        const otherIsEditingExistingItem = !item.isEditing && !item.isNew && isThereAnEditingItem;
        const otherIsEditingNewItem = !item.isEditing && item.isNew && isThereAnEditingItem;

        const otherIsEditing = otherIsEditingExistingItem || otherIsEditingNewItem;

        const cambio = itemCambiado(item);

        if (!cambio) item.isEditing = false;

        return (
          <div className="mb-4" key={item.id}>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 h-[40px] w-1/3 disabled:bg-gray-200 disabled:text-gray-600 pr-8"
                value={item.option}
                onChange={(e) => cambiarOpcion(item.id, e.target.value)}
                disabled={!item.isNew}
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
                        disabled={opcionDeshabilitada(opt, item.id)}
                        style={{
                          color: opcionDeshabilitada(opt, item.id) ? 'rgba(75, 85, 99, 0.7)' : 'black',
                          backgroundColor: opcionDeshabilitada(opt, item.id) ? '#E5E7EB' : 'transparent',
                        }}
                      >
                        {item.option || opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <input
                className="border rounded h-[40px] px-2 flex-grow"
                value={item.text}
                onChange={(e) => {
                  if (!item.isEditing && item.isNew === false) {
                    iniciarEdicion(item.id);
                  }
                  cambiarTexto(item.id, e.target.value);
                }}
                // Deshabilitado si hay otro item en edición y este no es el que se está editando
                disabled={otherIsEditing}
              />

              {item.isNew ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => cancelarItemNuevo(item.id)}
                    className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => confirmarItemNuevo(item.id)}
                    disabled={item.text.trim() === '' || item.option.trim() === ''}
                    className="bg-green-700 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    ✓
                  </button>
                </div>
              ) : cambio ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => cancelarEdicion(item.id)}
                    className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => confirmarEdicion(item.id)}
                    className="bg-green-700 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <button
                  disabled={isThereAnEditingItem}
                  onClick={() => eliminarItem(item.id)}
                  className={`bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded text-white ${
                    isThereAnEditingItem && 'bg-[#E5E7EB] text-[#4b5563] opacity-70 cursor-not-allowed'
                  }`}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        );
      })}
      <button
        disabled={isThereAnEditingItem}
        onClick={handleAddNewItem}
        className={`bg-blue-600 text-white px-3 py-2 rounded mt-2 ${
          isThereAnEditingItem && 'bg-[#E5E7EB] text-[#4b5563] opacity-70 cursor-not-allowed'
        }`}
      >
        Agregar característica
      </button>
    </div>
  );
}
