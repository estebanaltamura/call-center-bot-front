// ** Types
import { Entities } from 'types/dynamicSevicesTypes';

// ** Utils
import UTILS from 'utils';

// ** Services
import { SERVICES } from '..';

export const createBusiness = async (title: string) => {
  const payload = {
    title,
    features: [],
    services: [],
  };

  try {
    const newDoc = SERVICES.CMS.create(Entities.business, payload);
    return newDoc;
  } catch (error) {
    console.error('Error al crear documento:', error);
    UTILS.POPUPS.simplePopUp('Ocurrió un error al crear el negocio.');
  }
};
