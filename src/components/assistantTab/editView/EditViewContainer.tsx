// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** Components
import AddBullet from './addBullet/AddBullet';
import OrderedList from './orderedList/BulletList';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { SERVICES } from 'services/index';
import { Entities } from 'types/dynamicSevicesTypes';
import BulletList from './orderedList/BulletList';
import { useState } from 'react';

const EditViewContainer = () => {
  const { assistantToEdit, tempAssistantInformation, handleSave, handleCancel } = useAssistantContext();
  const [itemEditingIndex, setitemEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const MySwal = withReactContent(Swal);

  const saveHandler = async () => {
    if (tempAssistantInformation.length === 0) {
      await MySwal.fire({
        title: 'Tenés que ingresar al menos un bullet',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          title: 'custom-swal-title', // Clase personalizada para el título
        },
      });
      return;
    }
    handleSave();
  };

  const handleCancelHandler = async () => {
    const isNewAssistant = assistantToEdit?.features.length === 0;

    if (isNewAssistant) {
      const response = await MySwal.fire({
        title: 'Si cancelas la edición de un asistente nuevo se borrará',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        customClass: {
          title: 'custom-swal-title', // Clase personalizada para el título
        },
      });

      if (response.isConfirmed) {
        await SERVICES.CMS.delete(Entities.assistant, assistantToEdit.id);
        await MySwal.fire('¡Borrado!', 'El asistente ha sido borrado.', 'success');
        handleCancel();
      }
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
        <button onClick={saveHandler} className="bg-blue-600 text-white px-6 py-2 rounded">
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditViewContainer;
