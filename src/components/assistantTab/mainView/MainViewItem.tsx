// React
import { useEffect, useState } from 'react';

// ** Contexts
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, IAssistantEntity, StateTypes } from 'types/dynamicSevicesTypes';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MainViewItem = ({ docItem }: { docItem: IAssistantEntity }) => {
  const MySwal = withReactContent(Swal);

  const { handleModifyDoc, currentAssistant } = useAssistantContext();
  const [isActive, setIsActive] = useState(false);

  const softDeleteAssistantHandler = async () => {
    if (isActive) {
      await MySwal.fire({
        title: 'No puede eliminarse un asistente activo. Asignar otro como activo primero',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          title: 'custom-swal-title', // Clase personalizada para el título
        },
      });
      return;
    }

    const response = await MySwal.fire({
      title: 'Confirma que quieres eliminar este asistente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        title: 'custom-swal-title',
      },
    });

    if (response.isConfirmed) {
      SERVICES.CMS.softDelete(Entities.assistant, docItem.id);
      await MySwal.fire('¡Borrado!', 'El asistente ha sido eliminado.', 'success');
    }
  };

  const hardDeleteAssistantHandler = async () => {
    const response = await MySwal.fire({
      title: 'Confirma que quieres eliminar definitivamente este asistente. No se podrá recuperar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        title: 'custom-swal-title',
      },
    });

    if (response.isConfirmed) {
      SERVICES.CMS.delete(Entities.assistant, docItem.id);
      await MySwal.fire('¡Borrado!', 'El elemento ha sido eliminado.', 'success');
    }
  };

  const reactivateAssistantHandler = () => {
    if (confirm('Confirma que quieres reactivar este asistente')) {
      SERVICES.CMS.reactivateSoftDeleted(Entities.assistant, docItem.id);
    } else {
      return;
    }
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
        <button
          onClick={() => handleModifyDoc(docItem.id)}
          className="bg-green-600 text-white px-4 py-1 rounded h-[40px]"
        >
          Editar
        </button>

        {docItem.state === StateTypes.active ? (
          <button
            onClick={softDeleteAssistantHandler}
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
        {docItem.state === StateTypes.inactive && (
          <button
            onClick={hardDeleteAssistantHandler}
            className="bg-red-600 text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
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
