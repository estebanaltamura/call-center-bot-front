// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useRulesContext } from 'contexts/RulesProvider';
import { useLoadingContext } from 'contexts/LoadingProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IRulesEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

// ** Utils
import UTILS from 'utils';

const MainViewContainer = () => {
  // ** States
  const [newRulesTitle, setNewRulesTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allItemList, currentItem, setMode } = useRulesContext();
  const { handleModifyDoc } = useRulesContext();
  const { setIsLoading } = useLoadingContext();

  const activesSortedWithActiveFirst = allItemList
    .filter((item) => item.state === StateTypes.active)
    .sort((a, b) => a.title.localeCompare(b.title))
    .reduce((acc: IRulesEntity[], docItem) => {
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
        {orderedList.map((docItem: IRulesEntity, index: number) => (
          <MainViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    );
  };

  const createRulesHandler = async () => {
    if (!newRulesTitle) {
      await UTILS.POPUPS.simplePopUp('Ingresá un título para la nueva regla');
      return;
    }

    setIsLoading(true);
    const newDoc = await SERVICES.RULES.create(newRulesTitle);
    if (!newDoc) {
      await UTILS.POPUPS.simplePopUp('Ocurrio un error creando la nuevo regla');
      return;
    }

    handleModifyDoc(newDoc.id);
    setMode('edit');
    setNewRulesTitle('');
    setIsLoading(false);
  };

  useEffect(() => {
    allItemList.filter((item) => item.state === StateTypes.inactive).length === 0 &&
      setIncludeInactive(false);
  }, [allItemList]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">REGLAS</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 h-[40px] w-96"
          placeholder="Nombre de la nueva regla"
          value={newRulesTitle}
          onChange={(e) => setNewRulesTitle(e.target.value)}
        />
        <button onClick={createRulesHandler} className="button button1">
          Crear regla
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
        <p className="text-gray-500 ml-[10px]">No hay reglas creadas</p>
      )}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
