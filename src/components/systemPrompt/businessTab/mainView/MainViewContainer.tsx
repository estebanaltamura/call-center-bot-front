// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useLoadingContext } from 'contexts/LoadingProvider';
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IBusinessEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

// ** Utils
import UTILS from 'utils';

const MainViewContainer = () => {
  // ** States
  const [newBusinessTitle, setNewBusinessTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allBusinessesList, currentBusiness, setMode, handleModifyDoc } = useBusinessContext();
  const { setIsLoading } = useLoadingContext();

  const activesSortedWithActiveFirst = allBusinessesList
    .filter((item) => item.state === StateTypes.active)
    .sort((a, b) => a.title.localeCompare(b.title))
    .reduce((acc: IBusinessEntity[], docItem) => {
      if (docItem.title === currentBusiness?.title) {
        acc.unshift(docItem);
      } else {
        acc.push(docItem);
      }
      return acc;
    }, []);

  const inactivesSorted = allBusinessesList
    .filter((item) => item.state === StateTypes.inactive)
    .sort((a, b) => a.title.localeCompare(b.title));

  const orderedList = !includeInactive
    ? activesSortedWithActiveFirst
    : activesSortedWithActiveFirst.concat(inactivesSorted);

  const renderedItems = () => {
    return (
      <ul className="space-y-2">
        {orderedList.map((docItem: IBusinessEntity, index: number) => (
          <MainViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    );
  };

  const createBusinessHandler = async () => {
    if (!newBusinessTitle) {
      await UTILS.POPUPS.simplePopUp('Ingresá un título para el nuevo negocio');
      return;
    }

    setIsLoading(true);
    const newDoc = await SERVICES.BUSINESS.create(newBusinessTitle);
    if (!newDoc) {
      await UTILS.POPUPS.simplePopUp('Ocurrio un error creando el nuevo negocio');
      return;
    }

    handleModifyDoc(newDoc.id);
    setMode('edit');
    setNewBusinessTitle('');
    setIsLoading(false);
  };

  useEffect(() => {
    allBusinessesList.filter((item) => item.state === StateTypes.inactive).length === 0 &&
      setIncludeInactive(false);
  }, [allBusinessesList]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">NEGOCIO</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 h-[40px] w-96"
          placeholder="Nombre del nuevo negocio"
          value={newBusinessTitle}
          onChange={(e) => setNewBusinessTitle(e.target.value)}
        />
        <button onClick={createBusinessHandler} className="button button1">
          Crear negocio
        </button>
        <div className="flex-grow"></div>
        {allBusinessesList.filter((item) => item.state === StateTypes.inactive).length > 0 && (
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
      {allBusinessesList.filter((item) => item.state === StateTypes.active).length === 0 &&
        !includeInactive && <p className="text-gray-500 ml-[10px]">No hay negocios creados</p>}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
