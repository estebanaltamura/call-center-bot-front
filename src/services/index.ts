import { dynamicCreate } from './dynamicServices/dynamicCreate';
import { dynamicDelete } from './dynamicServices/dynamicDelete';
import { dynamicGet } from './dynamicServices/dynamicGet';
import { dynamicUpdate } from './dynamicServices/dynamicUpdate';
import { createSystemPrompt } from './promptServices/createSystemPrompt';

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
};
