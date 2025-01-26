// ** Contexts
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Utils
import UTILS from 'utils';

// ** Types
import { Entities, IcompanyEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** 3rd party library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// ** icons
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useAssistantContext } from 'contexts/AssistantProvider';

const MainViewItem = ({ docItem }: { docItem: IcompanyEntity }) => {
  const { handleModifyDoc, currentBussines } = useBusinessContext();

  const handleDownloadPDF = async () => {
    UTILS.PDF.createPdfFromSystemPrompt({ docItem });
  };

  const isActive = currentBussines?.title === docItem.title;

  const deleteCompanyHandler = () => {
    if (isActive) {
      alert('No puede eliminarse una empresa activa. Asignar otra como activa primero');
      return;
    }

    if (confirm('Confirma que quieres eliminar este documento')) {
      SERVICES.CMS.softDelete(Entities.companies, docItem.id);
    } else {
      return;
    }
  };

  const reactivateCompanyHandler = () => {
    if (confirm('Confirma que quieres reactivar este documento')) {
      SERVICES.CMS.reactivateSoftDeleted(Entities.companies, docItem.id);
    } else {
      return;
    }
  };

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
        <div className="flex gap-1">
          <span className="block text-sm text-gray-600">{docItem.features.length} bullets</span>
          <span className="block text-sm text-gray-600">{docItem.services.length} servicios</span>
        </div>
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
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center text-[18px] font-bold"
          title="Descargar PDF"
        >
          <FontAwesomeIcon icon={faFileArrowDown} className="text-[22px]" />
        </button>
        {docItem.state === StateTypes.active ? (
          <button
            onClick={deleteCompanyHandler}
            className="bg-red-600 text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        ) : (
          <button
            onClick={reactivateCompanyHandler}
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
