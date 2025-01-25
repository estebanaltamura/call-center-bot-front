import { Entities } from 'types/dynamicSevicesTypes';
import { SERVICES } from '..';

const updateCurrentKnowledgeTitle = async (currentKnowledgeName: string) => {
  try {
    const payload = { currentKnowledgeName };

    SERVICES.CMS.update(Entities.settings, 'global', payload);
  } catch (error) {
    console.error('Error al actualizar el currentPrompt en settings:', error);
    alert('No se pudo actualizar el currentPrompt. Intenta de nuevo.');
  }
};

export default updateCurrentKnowledgeTitle;
