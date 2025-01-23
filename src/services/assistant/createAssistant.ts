import { Entities } from 'types/dynamicSevicesTypes';
import UTILS from 'utils';
import { SERVICES } from '..';

export const createAssistant = async (title: string) => {
  if (!title.trim()) {
    UTILS.POPUPS.simplePopUp('Por favor ingresá un nombre para el asistente');
    return;
  }

  const payload = {
    title,
    features: [],
  };

  try {
    const newDoc = await SERVICES.CMS.create(Entities.assistant, payload);
    return newDoc;
  } catch (error) {
    console.error('Error al crear documento:', error);
    alert('Ocurrió un error al crear el documento.');
  }
};
