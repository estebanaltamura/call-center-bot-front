// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IAssistantEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';
import { useLoadingContext } from 'contexts/LoadingProvider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MainViewContainer = () => {
  // ** States
  const [newAssistantTitle, setNewAssistantTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allAssistantList, currentAssistant, setMode } = useAssistantContext();
  const { handleModifyDoc } = useAssistantContext();
  const { setIsLoading } = useLoadingContext();
  const MySwal = withReactContent(Swal);

  const sortedAndReorderedList = allAssistantList
    .sort((a, b) => a.title.localeCompare(b.title)) // Ordenar alfabéticamente por título
    .reduce((acc: IAssistantEntity[], docItem) => {
      // Mover el elemento actual al principio si coincide con `currentBussines`
      if (docItem.title === currentAssistant?.title) {
        acc.unshift(docItem);
      } else {
        acc.push(docItem);
      }
      return acc;
    }, [])
    .filter((docItem: IAssistantEntity) => {
      if (includeInactive) {
        return true;
      } else {
        return docItem.state === StateTypes.active;
      }
    }); // Filtrar solo los activos

  const renderedItems = () => {
    return (
      <ul className="space-y-2">
        {sortedAndReorderedList.map((docItem: IAssistantEntity, index: number) => (
          <MainViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    );
  };

  const createAssistantHandler = async () => {
    if (!newAssistantTitle) {
      await MySwal.fire({
        title: 'Ingresá un titulo para el nuevo asistente',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          title: 'custom-swal-title', // Clase personalizada para el título
        },
      });
      return;
    }

    setIsLoading(true);
    const newDoc = await SERVICES.ASSISTANT.create(newAssistantTitle);
    if (!newDoc) {
      await MySwal.fire({
        title: 'Ocurrio un error creando el nuevo asistente',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          title: 'custom-swal-title', // Clase personalizada para el título
        },
      });
      return;
    }

    handleModifyDoc(newDoc.id);
    setMode('edit');
    setNewAssistantTitle('');
    setIsLoading(false);
  };

  useEffect(() => {
    allAssistantList.filter((item) => item.state === StateTypes.inactive).length === 0 &&
      setIncludeInactive(false);
  }, [allAssistantList]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">ASISTENTE</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 py-1 w-72"
          placeholder="Nombre del nuevo asistente"
          value={newAssistantTitle}
          onChange={(e) => setNewAssistantTitle(e.target.value)}
        />
        <button onClick={createAssistantHandler} className="bg-blue-600 text-white px-4 py-1 rounded">
          Crear asistente
        </button>
        <div className="flex-grow"></div>
        {allAssistantList.filter((item) => item.state === StateTypes.inactive).length > 0 && (
          <div className="flex gap-2 items-center justify-center mr-4">
            <input
              type="checkbox"
              id="includeInactive"
              checked={includeInactive}
              onChange={() => setIncludeInactive((prev) => !prev)}
              className="w-4 h-4 cursor-pointer"
            />
            <span>Incluir eliminados</span>
          </div>
        )}
      </div>
      {allAssistantList.filter((item) => item.state === StateTypes.active).length === 0 && (
        <p className="text-gray-500">No hay asistentes aún.</p>
      )}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
