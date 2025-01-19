// ** Dynamic services
import { create } from './company/create';
import { dynamicCreate } from './dynamicServices/dynamicCreate';
import { dynamicDelete } from './dynamicServices/dynamicDelete';
import { dynamicGet } from './dynamicServices/dynamicGet';
import { dynamicUpdate } from './dynamicServices/dynamicUpdate';

// ** CustomServices
import updateCurrentPromptTitle from './settingsServices/updateCurrentPrompt';

export const SERVICES = {
  CMS: {
    create: dynamicCreate,
    update: dynamicUpdate,
    get: dynamicGet,
    delete: dynamicDelete,
  },
  COMPANY: {
    create: create,
  },
  SETTINGS: {
    updateCurrentPromptTitle: updateCurrentPromptTitle,
  },
};
