// ** React
import { useKnowledgeContextContext } from 'contexts/KnoledgeProvider';
import { useState } from 'react';

// ** Context

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IKnowledgeContextEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

const MainViewContainer = () => {
  // ** States
  const [newKnowledgeContextTitle, setNewKnowledgeContextTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allKnowledgeContextList, currentKnowledgeContext } = useKnowledgeContextContext();

  const sortedAndReorderedList = allKnowledgeContextList
    .sort((a, b) => a.title.localeCompare(b.title)) // Ordenar alfabéticamente por título
    .reduce((acc: IKnowledgeContextEntity[], docItem) => {
      // Mover el elemento actual al principio si coincide con `currentBussines`
      if (docItem.title === currentKnowledgeContext?.title) {
        acc.unshift(docItem);
      } else {
        acc.push(docItem);
      }
      return acc;
    }, [])
    .filter((docItem: IKnowledgeContextEntity) => {
      if (includeInactive) {
        return true;
      } else {
        return docItem.state === StateTypes.active;
      }
    }); // Filtrar solo los activos

  const renderedItems = () => {
    return (
      <ul className="space-y-2">
        {sortedAndReorderedList.map((docItem: IKnowledgeContextEntity, index: number) => (
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
          placeholder="Nombre del nuevo asistente"
          value={newKnowledgeContextTitle}
          onChange={(e) => setNewKnowledgeContextTitle(e.target.value)}
        />
        <button
          onClick={() => {
            SERVICES.KNOWLEDGE_CONTEXT.create(newKnowledgeContextTitle);
            setNewKnowledgeContextTitle('');
          }}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Crear asistente
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
          <span>Incluir eliminados</span>
        </div>
      </div>
      {allKnowledgeContextList.length === 0 && <p className="text-gray-500">No hay documentos aún.</p>}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
