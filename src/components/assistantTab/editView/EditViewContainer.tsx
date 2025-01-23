// ** React
import { useState } from 'react';

// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** Components
import AddBullet from './addBullet/AddBullet';
import BulletList from './orderedList/BulletList';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

const EditViewContainer = () => {
  const { assistantToEdit, tempAssistantInformation, handleSave, handleCancel } = useAssistantContext();
  const [itemEditingIndex, setitemEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const saveHandler = async () => {
    if (tempAssistantInformation.length === 0) {
      await UTILS.POPUPS.simplePopUp('Tenés que ingresar al menos un bullet');

      return;
    }
    handleSave();
  };

  const handleCancelHandler = async () => {
    const isNewAssistant = assistantToEdit?.features.length === 0;

    if (isNewAssistant) {
      UTILS.POPUPS.twoOptionsPopUp(
        'Si cancelas la edición de un asistente nuevo se borrará',
        () => SERVICES.CMS.delete(Entities.assistant, assistantToEdit.id),
        '¡Borrado!, El asistente ha sido borrado.',
      );
    } else handleCancel();
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">EDICION</h1>
      <div className="space-y-2">
        <label className="block text-xl font-semibold text-center text-gray-700">
          {assistantToEdit?.title.toUpperCase()}
        </label>
      </div>

      <AddBullet isEditing={isEditing} />
      <BulletList
        itemEditingIndex={itemEditingIndex}
        setitemEditingIndex={setitemEditingIndex}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <div className="flex justify-end gap-4 mr-[50px]">
        <button onClick={handleCancelHandler} className="bg-blue-200 text-black px-6 py-2 rounded">
          Cancelar
        </button>
        <button
          disabled={isEditing}
          onClick={saveHandler}
          className={`${isEditing ? 'disabled' : 'bg-blue-600 text-white'} px-6 py-2 rounded`}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditViewContainer;
