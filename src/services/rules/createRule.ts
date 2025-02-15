// ** Types
import { Entities } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

// ** Services
import { SERVICES } from '..';

export const createRule = async (title: string) => {
  const payload = {
    title,
    features: [],
  };

  try {
    const newDoc = SERVICES.CMS.create(Entities.rules, payload);
    return newDoc;
  } catch (error) {
    console.error('Error al crear documento:', error);
    UTILS.POPUPS.simplePopUp('Ocurrió un error al crear la regla.');
  }
};
