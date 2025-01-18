// ** Dynamic services
import { dynamicCreate } from './dynamicServices/dynamicCreate';
import { dynamicDelete } from './dynamicServices/dynamicDelete';
import { dynamicGet } from './dynamicServices/dynamicGet';
import { dynamicUpdate } from './dynamicServices/dynamicUpdate';

// ** CustomServices
import { createSystemPrompt } from './systemPromptServices/createSystemPrompt';
import updateCurrentPromptTitle from './settingsServices/updateCurrentPrompt';

export const SERVICES = {
  CMS: {
    create: dynamicCreate,
    update: dynamicUpdate,
    get: dynamicGet,
    delete: dynamicDelete,
  },
  PROMPT: {
    createSystemPrompt: createSystemPrompt,
  },
  SETTINGS: {
    updateCurrentPromptTitle: updateCurrentPromptTitle,
  },
};
