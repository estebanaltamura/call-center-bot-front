// ** Types
import { IOptionTextItem, IService } from 'types';

export enum Entities {
  'systemPrompts' = 'systemPrompts',
  'settings' = 'settings',
  'companies' = 'companies',
  'assistant' = 'assistant',
  'rules' = 'rules',
  'knowledgeContext' = 'knowledgeContext',
}

export type EntityTypesMapReturnedValues = {
  [Entities.systemPrompts]: ISystemPromptEntity;
  [Entities.settings]: ISettingsEntity;
  [Entities.companies]: IcompanyEntity;
  [Entities.assistant]: IAssistantEntity;
  [Entities.rules]: IRulesEntity;
  [Entities.knowledgeContext]: IKnowledgeContextEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.systemPrompts]: ISystemPrompt;
  [Entities.settings]: ISettings;
  [Entities.companies]: Icompany;
  [Entities.assistant]: IAssistant;
  [Entities.rules]: IRules;
  [Entities.knowledgeContext]: IKnowledgeContext;
};

export interface ISystemPromptEntity extends ISystemPrompt {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface ISettingsEntity extends ISettings {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IcompanyEntity extends Icompany {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IAssistantEntity extends IAssistant {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IRulesEntity extends IRules {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface IKnowledgeContextEntity extends IKnowledgeContext {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface ISystemPrompt {
  title: string;
  bullets: string[];
  services: IService[];
  prompt: string;
  servicesOrderIndex: number;
}

export interface ISettings {
  currentBussinesName: string;
  currentAssistantName: string;
  currentRulesName: string;
  currentKnowledgeContextName: string;
}

export interface Icompany {
  title: string;
  features: IOptionTextItem[];
  services: IService[];
  servicesOrderIndex: number;
}

export interface IAssistant {
  title: string;
  features: IOptionTextItem[];
}

export interface IRules {
  title: string;
  features: IOptionTextItem[];
}

export interface IKnowledgeContext {
  title: string;
  features: IOptionTextItem[];
}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
