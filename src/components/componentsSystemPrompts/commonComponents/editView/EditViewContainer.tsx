// ** React
import { useState } from 'react';

// ** Context
import { useDataContext } from 'contexts/DataContextProvider';

// ** Components
import AddBulletSection from 'components/componentsSystemPrompts/commonComponents/addBullet/AddBulletSection';
import BulletList from 'components/componentsSystemPrompts/commonComponents/bulletList/BulletList';
import AddServiceSection from 'components/componentsSystemPrompts/businessTab/editView/addService/AddService';
import ServicesList from 'components/componentsSystemPrompts/businessTab/editView/servicesList/ServicesList';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities } from 'types/dynamicSevicesTypes';
import { PromptComponentsEnum } from 'types';

// ** Utils
import UTILS from 'utils';

const EditViewContainer = ({ promptComponentType }: { promptComponentType: PromptComponentsEnum }) => {
  // Contexts
  const { itemToEdit, tempBullets, handleSave, handleCancel } = useDataContext(promptComponentType);

  // States
  const [itemEditingIndex, setitemEditingIndex] = useState<number | null>(null);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);

  const [isBulletEditing, setIsBulletEditing] = useState<boolean>(false);
  const [isServiceEditing, setIsServiceEditing] = useState<boolean>(false);

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
      adaptedText1 = 'de un asistente';
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      adaptedText1 = 'de un contexto de conocimiento';
      break;
    case PromptComponentsEnum.RULE:
      adaptedText1 = 'de una regla';
      break;
    case PromptComponentsEnum.BUSINESS:
      adaptedText1 = 'de un negocio';
      break;
    default:
      adaptedText1 = 'de un asistente';
      break;
  }

  let adaptedText2: string;

  switch (promptComponentType) {
    case PromptComponentsEnum.ASSISTANT:
      adaptedText2 = 'del asistente';
      break;
    case PromptComponentsEnum.KNOWLEDGE:
      adaptedText2 = 'del contexto de conocimiento';
      break;
    case PromptComponentsEnum.RULE:
      adaptedText2 = 'de la regla';
      break;
    case PromptComponentsEnum.BUSINESS:
      adaptedText2 = 'del negocio';
      break;
    default:
      adaptedText2 = 'del asistente';
      break;
  }

  const saveHandler = async () => {
    if (tempBullets.length === 0) {
      await UTILS.POPUPS.simplePopUp('Tenés que ingresar al menos un bullet');

      return;
    }
    handleSave();
  };

  const handleCancelHandler = async () => {
    const isNewItem = itemToEdit?.features.length === 0;

    if (isNewItem) {
      await UTILS.POPUPS.twoOptionsPopUp(
        `Si cancelas la edición ${adaptedText1} ${
          promptComponentType === PromptComponentsEnum.RULE ? 'nueva' : 'nuevo'
        }, este se borrará`,
        async () => {
          await SERVICES.CMS.delete(entity, itemToEdit.id);
          handleCancel();
        },
      );
    } else {
      await UTILS.POPUPS.twoOptionsPopUp(
        `Si cancelás la edición ${adaptedText2} perderás los cambios. ¿Estás seguro?`,
        () => handleCancel(),
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/*Header*/}
      <h1 className="text-xl font-bold text-center">EDICION</h1>
      <div className="space-y-2">
        <label className="block text-xl font-semibold text-center text-gray-700">
          {itemToEdit?.title.toUpperCase()}
        </label>
      </div>

      {/*Main */}
      <AddBulletSection
        promptComponentType={promptComponentType}
        isEditing={isBulletEditing || isServiceEditing}
      />
      {promptComponentType === PromptComponentsEnum.BUSINESS && (
        <AddServiceSection isEditing={isBulletEditing || isServiceEditing} />
      )}

      <BulletList
        itemEditingIndex={itemEditingIndex}
        setitemEditingIndex={setitemEditingIndex}
        isEditing={isBulletEditing}
        setIsEditing={setIsBulletEditing}
        promptComponentType={promptComponentType}
        disabled={isServiceEditing}
      />

      {promptComponentType === PromptComponentsEnum.BUSINESS && (
        <ServicesList
          itemEditingIndex={editingServiceIndex}
          setitemEditingIndex={setEditingServiceIndex}
          isEditing={isServiceEditing}
          setIsEditing={setIsServiceEditing}
          disabled={isBulletEditing}
        />
      )}

      {/* Botones de cancelar y guardar */}
      <div className="flex justify-end gap-4 mr-[50px]">
        <button onClick={handleCancelHandler} className="button button1 buttonSecondary">
          Cancelar
        </button>
        <button
          disabled={isBulletEditing || isServiceEditing}
          onClick={saveHandler}
          className={`button button1 ${(isBulletEditing || isServiceEditing) && 'disabled'}`}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditViewContainer;
