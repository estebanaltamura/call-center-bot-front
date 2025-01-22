import { Entities } from 'types/dynamicSevicesTypes';
import { SERVICES } from '..';

export const createAssistant = async (title: string) => {
  if (!title.trim()) {
    alert('Por favor, ingresa un nombre para el documento.');
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
