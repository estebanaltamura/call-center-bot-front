// React
import { useEffect, useState } from 'react';

// ** Contexts
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, IBusinessEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

const MainViewItem = ({ docItem }: { docItem: IBusinessEntity }) => {
  // Contexts
  const { handleModifyDoc, currentBusiness } = useBusinessContext();

  // States
  const [isActive, setIsActive] = useState(false);

  const softDeleteBusinessHandler = async () => {
    if (isActive) {
      await UTILS.POPUPS.simplePopUp(
        'No puede eliminarse un negocio activo. Asignar otro como activo primero',
      );

      return;
    }

    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres eliminar este negocio',
      () => SERVICES.CMS.softDelete(Entities.business, docItem.id),
      'El negocio ha sido eliminado.',
    );
  };

  const hardDeleteBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres eliminar definitivamente este negocio. No se podrá recuperar',
      () => SERVICES.CMS.delete(Entities.business, docItem.id),
      'El negocio ha sido eliminado.',
    );
  };

  const reactivateBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres reactivar este negocio',
      () => SERVICES.CMS.reactivateSoftDeleted(Entities.business, docItem.id),
      'El negocio ha sido reactivado.',
    );
  };

  useEffect(() => {
    setIsActive(currentBusiness?.title === docItem.title);
  }, [currentBusiness?.title, docItem.title]);

  return (
    <li
      key={docItem.id}
      className={`relative border p-2 rounded flex justify-between items-center`}
      style={{
        backgroundColor: isActive ? 'rgba(143, 0, 255, 0.2)' : 'rgba(156, 163, 175, 0.2)',
        border: `1px solid ${isActive ? 'rgba(143, 0, 255, 1)' : 'rgba(156, 163, 175, 1)'}`,
      }}
    >
      <div className="max-w-96">
        <p className="truncate">
          <strong>{docItem.title || '(Sin título)'}</strong>
        </p>
      </div>
      <p className="absolute right-1/2 flex justify-end items-center mr-3 font-bold text-blue-600">
        {isActive && 'ACTIVO'}
      </p>

      <div className="flex space-x-2">
        <button onClick={() => handleModifyDoc(docItem.id)} className="button button1 green">
          Editar
        </button>

        {docItem.state === StateTypes.active ? (
          <button
            onClick={softDeleteBusinessHandler}
            className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        ) : (
          <button
            onClick={reactivateBusinessHandler}
            className="violet text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Reactivar"
          >
            R
          </button>
        )}
        {docItem.state === StateTypes.inactive && (
          <button
            onClick={hardDeleteBusinessHandler}
            className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        )}
      </div>
    </li>
  );
};

export default MainViewItem;
