// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useLoadingContext } from 'contexts/LoadingProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, IHatEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

// ** Utils
import UTILS from 'utils';

const MainViewContainer = ({
  setMode,
  setEditItem,
  hatList,
}: {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;
  setEditItem: React.Dispatch<React.SetStateAction<IHatEntity | null>>;
  hatList: IHatEntity[];
}) => {
  // ** States
  const [newTitle, setNewTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { setIsLoading } = useLoadingContext();

  const activesSorted = hatList
    .filter((item) => item.state === StateTypes.active && item.softState === StateTypes.active)
    .sort((a, b) => a.title.localeCompare(b.title));

  const inactivesSorted = hatList
    .filter((item) => item.state === StateTypes.active && item.softState === StateTypes.inactive)
    .sort((a, b) => a.title.localeCompare(b.title));

  const orderedList = !includeInactive ? activesSorted : activesSorted.concat(inactivesSorted);

  const renderedItems = () => {
    return (
      <ul className="space-y-2">
        {orderedList.map((docItem: any, index: number) => (
          <MainViewItem key={index} item={docItem} setEditItem={setEditItem} setMode={setMode} />
        ))}
      </ul>
    );
  };

  const createBusinessHandler = async () => {
    if (!newTitle) {
      await UTILS.POPUPS.simplePopUp(`Ingresá un título para el nuevo sombrero`);
      return;
    }

    const isAInvalidTitle = hatList.filter((item) => item.title === newTitle).length > 0;

    if (isAInvalidTitle) {
      await UTILS.POPUPS.simplePopUp('El título ingresado ya fue usado en un item vigente o eliminado');

      return;
    }

    setIsLoading(true);
    const newDoc = await SERVICES.HAT.create(newTitle);
    if (!newDoc) {
      await UTILS.POPUPS.simplePopUp(`Ocurrio un error creando un sombrero`);
      return;
    }

    setEditItem(newDoc);
    setMode('edit');
    setNewTitle('');
    setIsLoading(false);
  };

  useEffect(() => {
    hatList.filter((item) => item.softState === StateTypes.inactive).length === 0 &&
      setIncludeInactive(false);
  }, [hatList]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">SOMBRERO</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 h-[40px] w-96"
          placeholder={`Nombre del nuevo sombrero`}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={createBusinessHandler} className="button button1">
          Crear sombrero
        </button>
        <div className="flex-grow"></div>
        {hatList.filter((item) => item.state === StateTypes.active && item.softState === StateTypes.inactive)
          .length > 0 && (
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
      {hatList.filter((item) => item.state === StateTypes.active && item.softState === StateTypes.active)
        .length === 0 &&
        !includeInactive && <p className="text-gray-500 ml-[10px]">No hay sombreros creados</p>}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
