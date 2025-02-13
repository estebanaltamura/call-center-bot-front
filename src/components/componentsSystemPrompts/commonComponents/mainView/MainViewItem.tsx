// React
import { useState } from 'react';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities, StateTypes } from 'types/dynamicSevicesTypes';
import { PromptComponentsEnum } from 'types';

// ** Utils
import UTILS from 'utils';

// ** Contexts
import { useDataContext } from 'contexts/DataContextProvider';

const MainViewItem = ({
  docItem,
  promptComponentType,
}: {
  docItem: any;
  promptComponentType: PromptComponentsEnum;
}) => {
  // Contexts
  const { handleModifyDoc } = useDataContext(promptComponentType);

  // States
  const [isActive, setIsActive] = useState(false);

  let entity: Entities;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      entity = Entities.assistant;
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      entity = Entities.knowledge;
      break;
    case PromptComponentsEnum.RULE:
      entity = Entities.rules;
      break;
    case PromptComponentsEnum.BUSINESS:
      entity = Entities.business;
      break;
    default:
      entity = Entities.assistant;
      break;
  }

  let adaptedText1: string;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      adaptedText1 = 'este asistente';
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      adaptedText1 = 'este contexto de conocimiento';
      break;
    case PromptComponentsEnum.RULE:
      adaptedText1 = 'esta regla';
      break;
    case PromptComponentsEnum.BUSINESS:
      adaptedText1 = 'este negocio';
      break;
    default:
      adaptedText1 = 'este asistente';
      break;
  }

  const softDeleteBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(`Confirma que quieres eliminar ${adaptedText1}`, () =>
      SERVICES.CMS.softDelete(entity, docItem.id),
    );
  };

  const hardDeleteBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(
      `Confirma que quieres eliminar definitivamente ${adaptedText1}. No se podrá recuperar`,
      () => SERVICES.CMS.dynamicHardDelete(entity, docItem.id),
    );
  };

  const reactivateBusinessHandler = async () => {
    await UTILS.POPUPS.twoOptionsPopUp(`Confirma que quieres reactivar ${adaptedText1}`, () =>
      SERVICES.CMS.reactivateSoftDeleted(entity, docItem.id),
    );
  };

  return (
    <li
      key={docItem.id}
      className={`relative border p-2 rounded flex justify-between items-center`}
      style={{
        backgroundColor: isActive
          ? 'rgba(143, 0, 255, 0.2)'
          : docItem.softState === StateTypes.active
          ? 'white'
          : 'rgba(156, 163, 175, 0.2)',
        border: `1px solid ${isActive ? 'rgba(143, 0, 255, 1)' : 'rgba(156, 163, 175, 1)'}`,
      }}
    >
      <div className="max-w-96">
        <p className="truncate">
          <strong>{docItem.title || '(Sin título)'}</strong>
        </p>
      </div>
      <p className="absolute right-1/2 flex justify-end items-center mr-3 font-bold text-blue-600">
        {isActive && 'ACTIVO'}
      </p>

      <div className="flex space-x-2">
        {docItem.softState === StateTypes.active ? (
          <>
            <button onClick={() => handleModifyDoc(docItem.id as string)} className="button button1 green">
              Editar
            </button>
            <button
              onClick={softDeleteBusinessHandler}
              className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
              title="Eliminar"
            >
              🗑️
            </button>
          </>
        ) : (
          <button
            onClick={reactivateBusinessHandler}
            className="violet text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Reactivar"
          >
            R
          </button>
        )}
        {docItem.softState === StateTypes.inactive && (
          <button
            onClick={hardDeleteBusinessHandler}
            className="red text-white px-1 py-1 rounded flex items-center w-[40px] h-[40px] justify-center"
            title="Eliminar"
          >
            🗑️
          </button>
        )}
      </div>
    </li>
  );
};

export default MainViewItem;
