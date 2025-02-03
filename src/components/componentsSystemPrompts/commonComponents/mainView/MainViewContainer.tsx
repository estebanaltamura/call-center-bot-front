// ** React
import { useEffect, useState } from 'react';

// ** Context
import { useLoadingContext } from 'contexts/LoadingProvider';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { StateTypes } from 'types/dynamicSevicesTypes';

// ** Components
import MainViewItem from './MainViewItem';

// ** Utils
import UTILS from 'utils';
import { PromptComponentsEnum } from 'types';
import { useDataContext } from 'contexts/DataContextProvider';

const MainViewContainer = ({ promptComponentType }: { promptComponentType: PromptComponentsEnum }) => {
  // ** States
  const [newTitle, setNewTitle] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);

  // ** Context
  const { allItemList, setMode, handleModifyDoc } = useDataContext(promptComponentType);
  const { setIsLoading } = useLoadingContext();

  let createFunction: (title: string) => Promise<any>;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      createFunction = SERVICES.ASSISTANT.create;
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      createFunction = SERVICES.KNOWLEDGE.create;
      break;
    case PromptComponentsEnum.RULE:
      createFunction = SERVICES.RULES.create;
      break;
    case PromptComponentsEnum.BUSINESS:
      createFunction = SERVICES.BUSINESS.create;
      break;
    default:
      createFunction = SERVICES.ASSISTANT.create;
      break;
  }

  let adaptedText1: string;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      adaptedText1 = 'el nuevo asistente';
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      adaptedText1 = 'el nuevo contexto de conocimiento';
      break;
    case PromptComponentsEnum.RULE:
      adaptedText1 = 'la nueva regla';
      break;
    case PromptComponentsEnum.BUSINESS:
      adaptedText1 = 'el nuevo negocio';
      break;
    default:
      adaptedText1 = 'el nuevo asistente';
      break;
  }

  let adaptedText2: string;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      adaptedText2 = 'del nuevo asistente';
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      adaptedText2 = 'del nuevo contexto de conocimiento';
      break;
    case PromptComponentsEnum.RULE:
      adaptedText2 = 'de la nueva regla';
      break;
    case PromptComponentsEnum.BUSINESS:
      adaptedText2 = 'del nuevo negocio';
      break;
    default:
      adaptedText2 = 'del nuevo asistente';
      break;
  }

  let adaptedText3: string;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      adaptedText3 = 'ASISTENTE';
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      adaptedText3 = 'CONTEXTO DE CONOCIMIENTO';
      break;
    case PromptComponentsEnum.RULE:
      adaptedText3 = 'REGLA';
      break;
    case PromptComponentsEnum.BUSINESS:
      adaptedText3 = 'NEGOCIO';
      break;
    default:
      adaptedText3 = 'ASISTENTE';
      break;
  }

  let adaptedText4: string;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      adaptedText4 = 'asistentes';
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      adaptedText4 = 'contextos de conocimiento';
      break;
    case PromptComponentsEnum.RULE:
      adaptedText4 = 'reglas';
      break;
    case PromptComponentsEnum.BUSINESS:
      adaptedText4 = 'negocios';
      break;
    default:
      adaptedText4 = 'asistentes';
      break;
  }

  let adaptedText5: string;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      adaptedText5 = 'asistente';
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      adaptedText5 = 'contextos de conocimiento';
      break;
    case PromptComponentsEnum.RULE:
      adaptedText5 = 'regla';
      break;
    case PromptComponentsEnum.BUSINESS:
      adaptedText5 = 'negocio';
      break;
    default:
      adaptedText5 = 'asistente';
      break;
  }

  const activesSorted = allItemList
    .filter((item) => item.state === StateTypes.active && item.softState === StateTypes.active)
    .sort((a, b) => a.title.localeCompare(b.title));

  const inactivesSorted = allItemList
    .filter((item) => item.state === StateTypes.active && item.softState === StateTypes.inactive)
    .sort((a, b) => a.title.localeCompare(b.title));

  const orderedList = !includeInactive ? activesSorted : activesSorted.concat(inactivesSorted);

  const renderedItems = () => {
    return (
      <ul className="space-y-2">
        {orderedList.map((docItem: any, index: number) => (
          <MainViewItem key={index} docItem={docItem} promptComponentType={promptComponentType} />
        ))}
      </ul>
    );
  };

  const createBusinessHandler = async () => {
    if (!newTitle) {
      await UTILS.POPUPS.simplePopUp(`Ingresá un título para ${adaptedText1}`);
      return;
    }

    const isAInvalidTitle = allItemList.filter((item) => item.title === newTitle).length > 0;

    if (isAInvalidTitle) {
      await UTILS.POPUPS.simplePopUp('El título ingresado ya fue usado en un item vigente o eliminado');

      return;
    }

    setIsLoading(true);
    const newDoc = await createFunction(newTitle);
    if (!newDoc) {
      await UTILS.POPUPS.simplePopUp(`Ocurrio un error creando ${adaptedText1}`);
      return;
    }

    handleModifyDoc(newDoc.id);
    setMode('edit');
    setNewTitle('');
    setIsLoading(false);
  };

  useEffect(() => {
    allItemList.filter((item) => item.softState === StateTypes.inactive).length === 0 &&
      setIncludeInactive(false);
  }, [allItemList]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">{adaptedText3}</h1>
      <div className="flex space-x-2 items-center">
        <input
          type="text"
          className="border rounded px-2 h-[40px] w-96"
          placeholder={`Nombre ${adaptedText2}`}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button onClick={createBusinessHandler} className="button button1">
          Crear {adaptedText5}
        </button>
        <div className="flex-grow"></div>
        {allItemList.filter(
          (item) => item.state === StateTypes.active && item.softState === StateTypes.inactive,
        ).length > 0 && (
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
      {allItemList.filter((item) => item.state === StateTypes.active && item.softState === StateTypes.active)
        .length === 0 &&
        !includeInactive && <p className="text-gray-500 ml-[10px]">No hay {adaptedText4} creados</p>}
      {renderedItems()}
    </div>
  );
};

export default MainViewContainer;
