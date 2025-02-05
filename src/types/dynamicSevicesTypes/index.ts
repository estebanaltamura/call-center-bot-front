// ** Types
import { IOptionTextItem, IService } from 'types';
import { Timestamp } from 'firebase/firestore';

export enum Entities {
  'reviews' = 'reviews',
  'messages' = 'messages',
  'conversations' = 'conversations',
  'systemPrompt' = 'systemPrompt',
  'settings' = 'settings',
  'business' = 'business',
  'assistant' = 'assistant',
  'rules' = 'rules',
  'knowledge' = 'knowledge',
  'hats' = 'hats',
  'stats_newConversations' = 'stats_newConversations',
  'stats_returnedConversations' = 'stats_returnedConversations',
  'stats_leads' = 'stats_leads',
  'stats_sales' = 'stats_sales',
  'stats_whatsappApiCost' = 'stats_whatsappApiCost',
  'stats_iaCost' = 'stats_iaCost',
  'stats_facebookAdsCost' = 'stats_facebookAdsCost',
  'stats_googleAdsCost' = 'stats_googleAdsCost',
}

export type EntityTypesMapReturnedValues = {
  [Entities.reviews]: IReviewsEntity;
  [Entities.messages]: IMessageEntity;
  [Entities.conversations]: IConversationsEntity;
  [Entities.systemPrompt]: ISystemPromptEntity;
  [Entities.settings]: ISettingsEntity;
  [Entities.business]: IBusinessEntity;
  [Entities.assistant]: IAssistantEntity;
  [Entities.rules]: IRulesEntity;
  [Entities.knowledge]: IKnowledgeEntity;
  [Entities.hats]: IHatEntity;
  [Entities.stats_newConversations]: IStats_newConversationsEntity;
  [Entities.stats_returnedConversations]: IStats_returnedConversationsEntity;
  [Entities.stats_leads]: IStats_leadsEntity;
  [Entities.stats_sales]: IStats_salesEntity;
  [Entities.stats_whatsappApiCost]: IStats_whatsappApiCostEntity;
  [Entities.stats_iaCost]: IStats_iaCostEntity;
  [Entities.stats_facebookAdsCost]: IStats_facebookAdsCostEntity;
  [Entities.stats_googleAdsCost]: IStats_googleAdsCostEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.reviews]: IReview;
  [Entities.messages]: IMessage;
  [Entities.conversations]: IConversations;
  [Entities.systemPrompt]: ISystemPrompt;
  [Entities.settings]: ISettings;
  [Entities.business]: IBusiness;
  [Entities.assistant]: IAssistant;
  [Entities.rules]: IRules;
  [Entities.knowledge]: IKnowledge;
  [Entities.hats]: IHat;
  [Entities.stats_newConversations]: IStats_newConversations;
  [Entities.stats_returnedConversations]: IStats_returnedConversations;
  [Entities.stats_leads]: IStats_leads;
  [Entities.stats_sales]: IStats_sales;
  [Entities.stats_whatsappApiCost]: IStats_whatsappApiCost;
  [Entities.stats_iaCost]: IStats_iaCost;
  [Entities.stats_facebookAdsCost]: IStats_facebookAdsCost;
  [Entities.stats_googleAdsCost]: IStats_googleAdsCost;
};

export interface IMessage {
  conversationId: string;
  message: string;
  sender: 'company' | 'customer';
}

export interface IReview {
  conversationId: string;
  confirmed: boolean;
  changes?: string[];
  comment?: string;
}
export interface IConversations {
  phoneNumber: string;
  status: ConversationStatusEnum;
  auto: boolean;
  lastMessageDate: Timestamp;
  lastReviewDate: Timestamp;
  brief?: string;
  name?: string;
  lastName?: string;
}

export enum ConversationStatusEnum {
  INPROGRESS = 'inProgress',
  LEAD = 'lead',
  NOLEAD = 'noLead',
  NOEVALUABLE = 'noEvaluable',
}
export interface ISystemPrompt {
  currentSystemPrompt: string;
}

export interface ISettings {
  currentBussinesName: string | null;
  currentAssistantName: string | null;
  currentRulesName: string | null;
  currentKnowledgeName: string | null;
}

export interface IBusiness {
  title: string;
  features: IOptionTextItem[];
  services: IService[];
}

export interface IAssistant {
  title: string;
  features: IOptionTextItem[];
}

export interface IRules {
  title: string;
  features: IOptionTextItem[];
}

export interface IKnowledge {
  title: string;
  features: IOptionTextItem[];
}
export interface IHat {
  title: string;
  description: string;
  knowledgeId: string;
  assistantId: string;
  businessId: string;
  ruleId: string;
  prompt: string;
}

export interface IStats_newConversations {
  data: number;
}
export interface IStats_returnedConversations {
  data: number;
}
export interface IStats_leads {
  data: number;
}
export interface IStats_sales {
  data: number;
}
export interface IStats_whatsappApiCost {
  data: number;
}
export interface IStats_iaCost {
  data: number;
}
export interface IStats_facebookAdsCost {
  data: number;
}
export interface IStats_googleAdsCost {
  data: number;
}

interface IEntity {
  id: string;
  softState: StateTypes;
  state: StateTypes;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  softDeletedAt: Timestamp;
  reactivatedAt: Timestamp;
}

export interface IMessageEntity extends IMessage, IEntity {}

export interface IReviewsEntity extends IReview, IEntity {}

export interface IConversationsEntity extends IConversations, IEntity {}

export interface IStats_newConversationsEntity extends IStats_newConversations, IEntity {}

export interface IStats_returnedConversationsEntity extends IStats_returnedConversations, IEntity {}

export interface IStats_leadsEntity extends IStats_leads, IEntity {}

export interface IStats_salesEntity extends IStats_sales, IEntity {}

export interface IStats_whatsappApiCostEntity extends IStats_whatsappApiCost, IEntity {}

export interface IStats_iaCostEntity extends IStats_iaCost, IEntity {}

export interface IStats_facebookAdsCostEntity extends IStats_facebookAdsCost, IEntity {}

export interface IStats_googleAdsCostEntity extends IStats_googleAdsCost, IEntity {}

export interface IKnowledgeEntity extends IKnowledge, IEntity {}

export interface ISystemPromptEntity extends ISystemPrompt, IEntity {}

export interface ISettingsEntity extends ISettings, IEntity {}

export interface IBusinessEntity extends IBusiness, IEntity {}

export interface IAssistantEntity extends IAssistant, IEntity {}

export interface IRulesEntity extends IRules, IEntity {}

export interface IHatEntity extends IHat, IEntity {}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
