// ** Dynamic services
import { dynamicCreate } from './dynamicServices/dynamicCreate';
import { dynamicDelete } from './dynamicServices/dynamicDelete';
import { dynamicGet } from './dynamicServices/dynamicGet';
import { dynamicReactivateSoftDeleted } from './dynamicServices/dynamicReactivateSoftDeleted';
import { dynamicSoftDelete } from './dynamicServices/dynamicSoftDelete';
import { dynamicUpdate } from './dynamicServices/dynamicUpdate';

// ** CustomServices
import updateCurrentBussinesTitle from './settingsServices/updateCurrentPrompt';
import { createCompany } from './company/createCompany';
import { createAssistant } from './assistant/createAssistant';
import updateCurrentAssistantTitle from './settingsServices/updateCurrentAssistantTitle';

export const SERVICES = {
  CMS: {
    create: dynamicCreate,
    update: dynamicUpdate,
    get: dynamicGet,
    delete: dynamicDelete,
    softDelete: dynamicSoftDelete,
    reactivateSoftDeleted: dynamicReactivateSoftDeleted,
  },
  COMPANY: {
    create: createCompany,
  },
  ASSISTANT: {
    create: createAssistant,
  },
  SETTINGS: {
    updateCurrentBussinesTitle: updateCurrentBussinesTitle,
    updateCurrentAssistantTitle: updateCurrentAssistantTitle,
  },
};
