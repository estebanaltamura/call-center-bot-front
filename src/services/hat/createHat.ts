// ** Types
import { Entities } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

// ** Services
import { SERVICES } from '..';

export const createHat = async (title: string) => {
  const payload = {
    title,
    description: '',
    knowledgeId: '',
    assistantId: '',
    businessId: '',
    ruleId: '',
  };

  try {
    const newDoc = SERVICES.CMS.create(Entities.hats, payload);
    return newDoc;
  } catch (error) {
    console.error('Error al crear documento:', error);
    UTILS.POPUPS.simplePopUp('Ocurrió un error al crear el sombrero.');
  }
};
