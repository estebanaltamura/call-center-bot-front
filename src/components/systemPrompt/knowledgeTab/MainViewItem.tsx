// React
import { useEffect, useState } from 'react';

// ** Contexts
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, IKnowledgeEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

const MainViewItem = ({ docItem }: { docItem: IKnowledgeEntity }) => {
  // Contexts
  const { handleModifyDoc, currentItem } = useKnowledgeContext();

  // States
  const [isActive, setIsActive] = useState(false);

  const softDeleteKnowledgeHandler = async () => {
    if (isActive) {
      await UTILS.POPUPS.simplePopUp(
        'No puede eliminarse un contexto de conocimiento activo. Asignar otro como activo primero',
      );

      return;
    }

    await UTILS.POPUPS.twoOptionsPopUp('Confirma que quieres eliminar este contexto de conocimiento', () =>
      SERVICES.CMS.softDelete(Entities.knowledge, docItem.id),
    );
  };

  const hardDeleteKnowledgeHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      'Confirma que quieres eliminar definitivamente este contexto de conocimiento. No se podrá recuperar',
      () => SERVICES.CMS.delete(Entities.knowledge, docItem.id),
    );
  };

  const reactivateKnowledgeHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp('Confirma que quieres reactivar este contexto de conocimiento', () =>
      SERVICES.CMS.reactivateSoftDeleted(Entities.knowledge, docItem.id),
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
            onClick={softDeleteKnowledgeHandler}
            className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        ) : (
          <button
            onClick={reactivateKnowledgeHandler}
            className="violet text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Reactivar"
          >
            R
          </button>
        )}
        {docItem.state === StateTypes.inactive && (
          <button
            onClick={hardDeleteKnowledgeHandler}
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
