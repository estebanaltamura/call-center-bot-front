import { Entities, StateTypes } from 'types/dynamicSevicesTypes';
import { SERVICES } from '..';

export const createKnowledgeContext = async (title: string) => {
  if (!title.trim()) {
    alert('Por favor, ingresa un nombre para el documento.');
    return;
  }

  const payload = {
    title,
    features: [],
    services: [],
    servicesOrderIndex: 0,
  };

  try {
    SERVICES.CMS.create(Entities.knowledgeContext, payload);
  } catch (error) {
    console.error('Error al crear documento:', error);
    alert('Ocurrió un error al crear el documento.');
  }
};
