// ** Contexts
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Utils
import UTILS from 'utils';

// ** Types
import { Entities, IAssistantEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** 3rd party library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// ** icons
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';

const MainViewItem = ({ docItem }: { docItem: IAssistantEntity }) => {
  const { handleModifyDoc, currentAssistant } = useAssistantContext();

  const isActive = currentAssistant?.title === docItem.title;

  const deleteAssistantHandler = () => {
    if (isActive) {
      alert('No puede eliminarse una empresa activa. Asignar otra como activa primero');
      return;
    }

    if (confirm('Confirma que quieres eliminar este documento')) {
      SERVICES.CMS.softDelete(Entities.assistant, docItem.id);
    } else {
      return;
    }
  };

  const reactivateAssistantHandler = () => {
    if (confirm('Confirma que quieres reactivar este documento')) {
      SERVICES.CMS.reactivateSoftDeleted(Entities.assistant, docItem.id);
    } else {
      return;
    }
  };

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
        <button
          onClick={() => handleModifyDoc(docItem.id)}
          className="bg-green-600 text-white px-4 py-1 rounded h-[40px]"
        >
          Editar
        </button>

        <button
          className="bg-blue-600 text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center text-[18px] font-bold"
          title="Descargar PDF"
        >
          <FontAwesomeIcon icon={faFileArrowDown} className="text-[22px]" />
        </button>
        {docItem.state === StateTypes.active ? (
          <button
            onClick={deleteAssistantHandler}
            className="bg-red-600 text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        ) : (
          <button
            onClick={reactivateAssistantHandler}
            className="bg-violet-600 text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Reactivar"
          >
            R
          </button>
        )}
      </div>
    </li>
  );
};

export default MainViewItem;
