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
import { PromptComponentsEnum } from 'types';
import { useDataContext } from 'contexts/DataContextProvider';

const MainViewItem = ({
  docItem,
  promptComponentType,
}: {
  docItem: any;
  promptComponentType: PromptComponentsEnum;
}) => {
  // Contexts
  const { handleModifyDoc } = useDataContext(promptComponentType);

  // States
  const [isActive, setIsActive] = useState(false);

  const softDeleteBusinessHandler = async () => {
    if (isActive) {
      await UTILS.POPUPS.simplePopUp(
        'No puede eliminarse un negocio activo. Asignar otro como activo primero',
      );

      return;
    }

    await UTILS.POPUPS.twoOptionsPopUp('Confirma que quieres eliminar este negocio', () =>
      SERVICES.CMS.softDelete(Entities.business, docItem.id),
    );
  };

  const hardDeleteBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres eliminar definitivamente este negocio. No se podrá recuperar',
      () => SERVICES.CMS.delete(Entities.business, docItem.id),
    );
  };

  const reactivateBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp('Confirma que quieres reactivar este negocio', () =>
      SERVICES.CMS.reactivateSoftDeleted(Entities.business, docItem.id),
    );
  };

  return (
    <li
      key={docItem.id}
      className={`relative border p-2 rounded flex justify-between items-center`}
      style={{
        backgroundColor: isActive
          ? 'rgba(143, 0, 255, 0.2)'
          : docItem.state === StateTypes.active
          ? 'white'
          : 'rgba(156, 163, 175, 0.2)',
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
        {docItem.state === StateTypes.active ? (
          <>
            <button onClick={() => handleModifyDoc(docItem.id as string)} className="button button1 green">
              Editar
            </button>
            <button
              onClick={softDeleteBusinessHandler}
              className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
              title="Eliminar"
            >
              🗑️
            </button>
          </>
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
