// ** React
import { useState } from 'react';

// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** Components
import AddBulletSection from './addBullet/AddBullet';
import BulletList from './bulletList/BulletList';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

const EditViewContainer = () => {
  // Contexts
  const { assistantToEdit, tempAssistantData, handleSave, handleCancel } = useAssistantContext();

  // States
  const [itemEditingIndex, setitemEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const saveHandler = async () => {
    if (tempAssistantData.length === 0) {
      await UTILS.POPUPS.simplePopUp('Tenés que ingresar al menos un bullet');

      return;
    }
    handleSave();
  };

  const handleCancelHandler = async () => {
    const isNewAssistant = assistantToEdit?.features.length === 0;

    if (isNewAssistant) {
      await UTILS.POPUPS.twoOptionsPopUp(
        'Si cancelas la edición de un asistente nuevo este borrará',
        () => SERVICES.CMS.delete(Entities.assistant, assistantToEdit.id),
        'El asistente ha sido borrado.',
      );
      handleCancel();
    } else {
      await UTILS.POPUPS.twoOptionsPopUp(
        'Si cancelás la edición del asistente perderás los cambios. ¿Estás seguro?',
        () => handleCancel(),
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/*Header*/}
      <h1 className="text-xl font-bold text-center">EDICION</h1>
      <div className="space-y-2">
        <label className="block text-xl font-semibold text-center text-gray-700">
          {assistantToEdit?.title.toUpperCase()}
        </label>
      </div>

      {/*Main */}
      <AddBulletSection isEditing={isEditing} />
      <BulletList
        itemEditingIndex={itemEditingIndex}
        setitemEditingIndex={setitemEditingIndex}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      {/* Botones de cancelar y guardar */}
      <div className="flex justify-end gap-4 mr-[50px]">
        <button onClick={handleCancelHandler} className="button button1 buttonSecondary">
          Cancelar
        </button>
        <button
          disabled={isEditing}
          onClick={saveHandler}
          className={`button button1 ${isEditing && 'disabled'}`}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditViewContainer;
