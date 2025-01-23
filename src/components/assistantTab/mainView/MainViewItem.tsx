// React
import { useEffect, useState } from 'react';

// ** Contexts
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, IAssistantEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

const MainViewItem = ({ docItem }: { docItem: IAssistantEntity }) => {
  // Contexts
  const { handleModifyDoc, currentAssistant } = useAssistantContext();

  // States
  const [isActive, setIsActive] = useState(false);

  const softDeleteAssistantHandler = async () => {
    if (isActive) {
      await UTILS.POPUPS.simplePopUp(
        'No puede eliminarse un asistente activo. Asignar otro como activo primero',
      );

      return;
    }

    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres eliminar este asistente',
      () => SERVICES.CMS.softDelete(Entities.assistant, docItem.id),
      'El asistente ha sido eliminado.',
    );
  };

  const hardDeleteAssistantHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres eliminar definitivamente este asistente. No se podrá recuperar',
      () => SERVICES.CMS.delete(Entities.assistant, docItem.id),
      'El asistente ha sido eliminado.',
    );
  };

  const reactivateAssistantHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres reactivar este asistente',
      () => SERVICES.CMS.reactivateSoftDeleted(Entities.assistant, docItem.id),
      'El asistente ha sido reactivado.',
    );
  };

  useEffect(() => {
    setIsActive(currentAssistant?.title === docItem.title);
  }, [currentAssistant?.title, docItem.title]);

  return (
    <li
      key={docItem.id}
      className={`border p-2 rounded flex justify-between items-center`}
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
            onClick={softDeleteAssistantHandler}
            className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        ) : (
          <button
            onClick={reactivateAssistantHandler}
            className="violet text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Reactivar"
          >
            R
          </button>
        )}
        {docItem.state === StateTypes.inactive && (
          <button
            onClick={hardDeleteAssistantHandler}
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
