// ** React
import { useState } from 'react';

// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IcompanyEntity } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

const MainViewContainer = () => {
  // ** States
  const [newPromptTitle, setNewPromptTitle] = useState<string>('');

  // ** Context
  const { allBussinesesList } = useCompanyContext();

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
      </div>
      {allBussinesesList.length === 0 && <p className="text-gray-500">No hay documentos aún.</p>}
      <ul className="space-y-2">
        {allBussinesesList.map((docItem: IcompanyEntity, index: number) => (
          <MainViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    </div>
  );
};

export default MainViewContainer;
