import React, { useState } from 'react';

// ** Components
import PromptComponentSelects from './PromptComponentSelects';

// ** Types
import { Entities, IHatEntity } from 'types/dynamicSevicesTypes';
import { SERVICES } from 'services/index';

const EditViewContainer = ({
  editItem,
  setEditItem,
  setMode,
}: {
  editItem: IHatEntity;
  setEditItem: React.Dispatch<React.SetStateAction<IHatEntity | null>>;
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;
}) => {
  // ** States
  const [tempDescription, setTempDescription] = useState<string>(editItem.description);
  const [itemEditingIndex, setitemEditingIndex] = useState<number | null>(null);

  const cancelHandler = () => {
    setEditItem(null);
    setMode('main');
  };

  const saveHandler = async () => {
    const payload = {
      description: tempDescription,
    };
    if (editItem.description !== tempDescription) SERVICES.CMS.update(Entities.hats, editItem.id, payload);
    setEditItem(null);
    setMode('main');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="text-xl font-bold text-center">EDICIÓN</h1>
      <div className="space-y-2">
        <label className="block text-xl font-semibold text-center text-gray-700">
          {editItem?.title.toUpperCase()}
        </label>
      </div>

      {/* Input de descripción */}
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y scroll-custom"
        placeholder="Ingresá una descripción"
        rows={3}
        value={tempDescription}
        onChange={(e) => setTempDescription(e.target.value)}
      />

      <PromptComponentSelects editItem={editItem} />

      {/* Botones de cancelar y guardar */}
      <div className="flex justify-end gap-4 mr-[50px]">
        <button onClick={cancelHandler} className="button button1 buttonSecondary">
          Cancelar
        </button>
        <button onClick={saveHandler} className="button button1">
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditViewContainer;
