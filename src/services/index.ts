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
import updateCurrentRulesTitle from './settingsServices/updateCurrentRulesTitle';
import { createRule } from './rules/createRule';
import { createKnowledge } from './knowledge/createKnowledge';
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
  COMPANY: {
    create: createCompany,
  },
  ASSISTANT: {
    create: createAssistant,
  },
  RULES: {
    create: createRule,
  },
  KNOWLEDGE_CONTEXT: {
    create: createKnowledge,
  },
  SETTINGS: {
    updateCurrentBussinesTitle: updateCurrentBussinesTitle,
    updateCurrentAssistantTitle: updateCurrentAssistantTitle,
    updateCurrentRulesTitle: updateCurrentRulesTitle,
    updateCurrentKnowledgeContextTitle: updateCurrentKnowledgeTitle,
  },
};
