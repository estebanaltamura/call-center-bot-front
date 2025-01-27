// React
import { useEffect, useState } from 'react';

// ** Contexts
import { useRulesContext } from 'contexts/RulesProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, IRulesEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

const MainViewItem = ({ docItem }: { docItem: IRulesEntity }) => {
  // Contexts
  const { handleModifyDoc, currentItem } = useRulesContext();

  // States
  const [isActive, setIsActive] = useState(false);

  const softDeleteRulesHandler = async () => {
    if (isActive) {
      await UTILS.POPUPS.simplePopUp(
        'No puede eliminarse una regla activa. Asignar otro como activo primero',
      );

      return;
    }

    await UTILS.POPUPS.twoOptionsPopUp('Confirma que quieres eliminar esta regla', () =>
      SERVICES.CMS.softDelete(Entities.rules, docItem.id),
    );
  };

  const hardDeleteRulesHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres eliminar definitivamente esta regla. No se podrá recuperar',
      () => SERVICES.CMS.delete(Entities.rules, docItem.id),
    );
  };

  const reactivateRulesHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp('Confirma que quieres reactivar esta regla', () =>
      SERVICES.CMS.reactivateSoftDeleted(Entities.rules, docItem.id),
    );
  };

  useEffect(() => {
    setIsActive(currentItem?.title === docItem.title);
  }, [currentItem?.title, docItem.title]);

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
            onClick={softDeleteRulesHandler}
            className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        ) : (
          <button
            onClick={reactivateRulesHandler}
            className="violet text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Reactivar"
          >
            R
          </button>
        )}
        {docItem.state === StateTypes.inactive && (
          <button
            onClick={hardDeleteRulesHandler}
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
