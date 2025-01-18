import { Entities } from 'types/dynamicSevicesTypes';
import { SERVICES } from '..';

export const createSystemPrompt = async (title: string) => {
  if (!title.trim()) {
    alert('Por favor, ingresa un nombre para el documento.');
    return;
  }

  const payload = {
    title,
    bullets: [],
    services: [],
    prompt: '',
    servicesOrderIndex: 0,
  };

  try {
    SERVICES.CMS.create(Entities.systemPrompts, payload);
  } catch (error) {
    console.error('Error al crear documento:', error);
    alert('Ocurrió un error al crear el documento.');
  }
};
