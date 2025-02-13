// ** Dynamic services
import { dynamicCreate } from './dynamicServices/dynamicCreate';
import { dynamicHardDelete } from './dynamicServices/dynamicHardDelete';
import { dynamicGet } from './dynamicServices/dynamicGet';
import { dynamicReactivateSoftDeleted } from './dynamicServices/dynamicReactivateSoftDeleted';
import { dynamicSoftDelete } from './dynamicServices/dynamicSoftDelete';
import { dynamicUpdate } from './dynamicServices/dynamicUpdate';

// ** CustomServices
import { createBusiness } from './company/createBusiness';
import { createAssistant } from './assistant/createAssistant';
import { createRule } from './rules/createRule';
import { createKnowledge } from './knowledge/createKnowledge';
import updateCurrentBussinesTitle from './settingsServices/updateCurrentPrompt';
import updateCurrentAssistantTitle from './settingsServices/updateCurrentAssistantTitle';
import updateCurrentRulesTitle from './settingsServices/updateCurrentRulesTitle';
import updateCurrentKnowledgeTitle from './settingsServices/updateCurrentKnowledgeTitle';
import { createHat } from './hat/createHat';
import { dynamicDelete } from './dynamicServices/dynamicDelete';

export const SERVICES = {
  CMS: {
    create: dynamicCreate,
    update: dynamicUpdate,
    get: dynamicGet,
    softDelete: dynamicSoftDelete,
    dynamicHardDelete: dynamicHardDelete,
    delete: dynamicDelete,
    reactivateSoftDeleted: dynamicReactivateSoftDeleted,
  },
  BUSINESS: {
    create: createBusiness,
  },
  ASSISTANT: {
    create: createAssistant,
  },
  RULES: {
    create: createRule,
  },
  KNOWLEDGE: {
    create: createKnowledge,
  },
  HAT: {
    create: createHat,
  },
  SETTINGS: {
    updateCurrentBussinesTitle: updateCurrentBussinesTitle,
    updateCurrentAssistantTitle: updateCurrentAssistantTitle,
    updateCurrentRulesTitle: updateCurrentRulesTitle,
    updateCurrentKnowledgeContextTitle: updateCurrentKnowledgeTitle,
  },
};
