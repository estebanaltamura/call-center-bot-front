// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** Components
import AddBulletSection from './addBullet/AddBullet';
import BulletList from './bulletList/BulletList';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';
import AddServiceSection from './addService/AddService';
import ServicesList from './servicesList/ServicesList';

const EditViewContainer = () => {
  // Contexts
  const { businessToEdit, tempBusinessData, handleSave, handleCancel } = useBusinessContext();

  // States
  const [itemEditingIndex, setitemEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const saveHandler = async () => {
    if (tempBusinessData.length === 0) {
      await UTILS.POPUPS.simplePopUp('Tenés que ingresar al menos un bullet');

      return;
    }
    handleSave();
  };

  const handleCancelHandler = async () => {
    const isNewBusiness = businessToEdit?.features.length === 0;

    if (isNewBusiness) {
      await UTILS.POPUPS.twoOptionsPopUp(
        'Si cancelas la edición de un asistente nuevo este borrará',
        async () => {
          await SERVICES.CMS.delete(Entities.business, businessToEdit.id);
          handleCancel();
        },
        'El asistente ha sido borrado.',
      );
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
          {businessToEdit?.title.toUpperCase()}
        </label>
      </div>

      {/*Main */}
      <AddBulletSection isEditing={isEditing} />
      <AddServiceSection isEditing={isEditing} />
      <BulletList
        itemEditingIndex={itemEditingIndex}
        setitemEditingIndex={setitemEditingIndex}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <ServicesList />

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
