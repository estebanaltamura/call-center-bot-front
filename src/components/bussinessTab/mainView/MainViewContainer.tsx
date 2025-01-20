// ** React
import { useState } from 'react';

// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IcompanyEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

const MainViewContainer = () => {
  // ** States
  const [newPromptTitle, setNewPromptTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allBussinesesList, currentBussines } = useCompanyContext();

  const sortedAndReorderedList = allBussinesesList
    .sort((a, b) => a.title.localeCompare(b.title)) // Ordenar alfabéticamente por título
    .reduce((acc: IcompanyEntity[], docItem) => {
      // Mover el elemento actual al principio si coincide con `currentBussines`
      if (docItem.title === currentBussines?.title) {
        acc.unshift(docItem);
      } else {
        acc.push(docItem);
      }
      return acc;
    }, [])
    .filter((docItem: IcompanyEntity) => {
      if (includeInactive) {
        return true;
      } else {
        return docItem.state === StateTypes.active;
      }
    }); // Filtrar solo los activos

  const renderedItems = () => {
    return (
      <ul className="space-y-2">
        {sortedAndReorderedList.map((docItem: IcompanyEntity, index: number) => (
          <MainViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">NEGOCIO</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 py-1 w-72"
          placeholder="Nombre del nuevo negocio"
          value={newPromptTitle}
          onChange={(e) => setNewPromptTitle(e.target.value)}
        />
        <button
          onClick={() => {
            SERVICES.COMPANY.create(newPromptTitle);
            setNewPromptTitle('');
          }}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Crear negocio
        </button>
        <div className="flex-grow"></div>
        <div className="flex gap-2 items-center justify-center mr-4">
          <input
            type="checkbox"
            id="includeInactive"
            checked={includeInactive}
            onChange={() => setIncludeInactive((prev) => !prev)}
            className="w-4 h-4 cursor-pointer"
          />
          <span>Incluir borrados</span>
        </div>
      </div>
      {allBussinesesList.length === 0 && <p className="text-gray-500">No hay documentos aún.</p>}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
