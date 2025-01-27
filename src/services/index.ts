// ** Dynamic services
import { dynamicCreate } from './dynamicServices/dynamicCreate';
import { dynamicDelete } from './dynamicServices/dynamicDelete';
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

export const SERVICES = {
  CMS: {
    create: dynamicCreate,
    update: dynamicUpdate,
    get: dynamicGet,
    delete: dynamicDelete,
    softDelete: dynamicSoftDelete,
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
  SETTINGS: {
    updateCurrentBussinesTitle: updateCurrentBussinesTitle,
    updateCurrentAssistantTitle: updateCurrentAssistantTitle,
    updateCurrentRulesTitle: updateCurrentRulesTitle,
    updateCurrentKnowledgeContextTitle: updateCurrentKnowledgeTitle,
  },
};
