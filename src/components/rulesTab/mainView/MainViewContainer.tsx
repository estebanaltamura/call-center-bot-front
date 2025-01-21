// ** React
import { useState } from 'react';

// ** Context
import { useRulesContext } from 'contexts/RulesProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { IRulesEntity, StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

const MainViewContainer = () => {
  // ** States
  const [newRulesTitle, setNewRulesTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allRulesList, currentRules } = useRulesContext();

  const sortedAndReorderedList = allRulesList
    .sort((a, b) => a.title.localeCompare(b.title)) // Ordenar alfabéticamente por título
    .reduce((acc: IRulesEntity[], docItem) => {
      // Mover el elemento actual al principio si coincide con `currentBussines`
      if (docItem.title === currentRules?.title) {
        acc.unshift(docItem);
      } else {
        acc.push(docItem);
      }
      return acc;
    }, [])
    .filter((docItem: IRulesEntity) => {
      if (includeInactive) {
        return true;
      } else {
        return docItem.state === StateTypes.active;
      }
    }); // Filtrar solo los activos

  const renderedItems = () => {
    return (
      <ul className="space-y-2">
        {sortedAndReorderedList.map((docItem: IRulesEntity, index: number) => (
          <MainViewItem key={index} docItem={docItem} />
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">REGLAS</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 py-1 w-72"
          placeholder="Nombre de la nueva regla"
          value={newRulesTitle}
          onChange={(e) => setNewRulesTitle(e.target.value)}
        />
        <button
          onClick={() => {
            SERVICES.RULES.create(newRulesTitle);
            setNewRulesTitle('');
          }}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Crear regla
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
      {allRulesList.length === 0 && <p className="text-gray-500">No hay documentos aún.</p>}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
