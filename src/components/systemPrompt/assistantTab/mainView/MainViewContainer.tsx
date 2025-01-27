// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useLoadingContext } from 'contexts/LoadingProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IAssistantEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

// ** Utils
import UTILS from 'utils';

const MainViewContainer = () => {
  // ** States
  const [newAssistantTitle, setNewAssistantTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allItemList, currentItem, setMode, handleModifyDoc } = useAssistantContext();
  const { setIsLoading } = useLoadingContext();

  const activesSortedWithActiveFirst = allItemList
    .filter((item) => item.state === StateTypes.active)
    .sort((a, b) => a.title.localeCompare(b.title))
    .reduce((acc: IAssistantEntity[], docItem) => {
      if (docItem.title === currentItem?.title) {
        acc.unshift(docItem);
      } else {
        acc.push(docItem);
      }
      return acc;
    }, []);

  const inactivesSorted = allItemList
    .filter((item) => item.state === StateTypes.inactive)
    .sort((a, b) => a.title.localeCompare(b.title));

  const orderedList = !includeInactive
    ? activesSortedWithActiveFirst
    : activesSortedWithActiveFirst.concat(inactivesSorted);

  const renderedItems = () => {
    return (
      <ul className="space-y-2">
        {orderedList.map((docItem: IAssistantEntity, index: number) => (
          <MainViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    );
  };

  const createAssistantHandler = async () => {
    if (!newAssistantTitle) {
      await UTILS.POPUPS.simplePopUp('Ingresá un título para el nuevo asistente');
      return;
    }

    setIsLoading(true);
    const newDoc = await SERVICES.ASSISTANT.create(newAssistantTitle);
    if (!newDoc) {
      await UTILS.POPUPS.simplePopUp('Ocurrio un error creando el nuevo asistente');
      return;
    }

    handleModifyDoc(newDoc.id);
    setMode('edit');
    setNewAssistantTitle('');
    setIsLoading(false);
  };

  useEffect(() => {
    allItemList.filter((item) => item.state === StateTypes.inactive).length === 0 &&
      setIncludeInactive(false);
  }, [allItemList]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">ASISTENTE</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 h-[40px] w-96"
          placeholder="Nombre del nuevo asistente"
          value={newAssistantTitle}
          onChange={(e) => setNewAssistantTitle(e.target.value)}
        />
        <button onClick={createAssistantHandler} className="button button1">
          Crear asistente
        </button>
        <div className="flex-grow"></div>
        {allItemList.filter((item) => item.state === StateTypes.inactive).length > 0 && (
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
      {allItemList.filter((item) => item.state === StateTypes.active).length === 0 && !includeInactive && (
        <p className="text-gray-500 ml-[10px]">No hay asistentes creados</p>
      )}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
