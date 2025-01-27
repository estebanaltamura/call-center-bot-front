// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';
import { useLoadingContext } from 'contexts/LoadingProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IKnowledgeEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

// ** Utils
import UTILS from 'utils';

const MainViewContainer = () => {
  // ** States
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allItemList, currentItem, setMode } = useKnowledgeContext();
  const { handleModifyDoc } = useKnowledgeContext();
  const { setIsLoading } = useLoadingContext();

  const activesSortedWithActiveFirst = allItemList
    .filter((item) => item.state === StateTypes.active)
    .sort((a, b) => a.title.localeCompare(b.title))
    .reduce((acc: IKnowledgeEntity[], docItem) => {
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
        {orderedList.map((docItem: IKnowledgeEntity, index: number) => (
          <MainViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    );
  };

  const createKnowledgeHandler = async () => {
    if (!newKnowledgeTitle) {
      await UTILS.POPUPS.simplePopUp('Ingresá un título para el nuevo contexto de conocimiento');
      return;
    }

    setIsLoading(true);
    const newDoc = await SERVICES.KNOWLEDGE.create(newKnowledgeTitle);
    if (!newDoc) {
      await UTILS.POPUPS.simplePopUp('Ocurrio un error creando el nuevo contexto de conocimiento');
      return;
    }

    handleModifyDoc(newDoc.id);
    setMode('edit');
    setNewKnowledgeTitle('');
    setIsLoading(false);
  };

  useEffect(() => {
    allItemList.filter((item) => item.state === StateTypes.inactive).length === 0 &&
      setIncludeInactive(false);
  }, [allItemList]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">CONOCIMIENTO</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 h-[40px] w-96"
          placeholder="Nombre del nuevo contexto de conocimiento"
          value={newKnowledgeTitle}
          onChange={(e) => setNewKnowledgeTitle(e.target.value)}
        />
        <button onClick={createKnowledgeHandler} className="button button1">
          Crear contexto de conocimiento
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
        <p className="text-gray-500 ml-[10px]">No hay contextos de conocimiento creados</p>
      )}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
