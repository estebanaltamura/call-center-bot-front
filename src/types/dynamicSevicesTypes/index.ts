// ** Types
import { IOptionTextItem, IService } from 'types';

export enum Entities {
  'systemPrompt' = 'systemPrompt',
  'settings' = 'settings',
  'companies' = 'companies',
  'assistant' = 'assistant',
  'rules' = 'rules',
  'knowledge' = 'knowledge',
}

export type EntityTypesMapReturnedValues = {
  [Entities.systemPrompt]: ISystemPromptEntity;
  [Entities.settings]: ISettingsEntity;
  [Entities.companies]: IcompanyEntity;
  [Entities.assistant]: IAssistantEntity;
  [Entities.rules]: IRulesEntity;
  [Entities.knowledge]: IKnowledgeEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.systemPrompt]: ISystemPrompt;
  [Entities.settings]: ISettings;
  [Entities.companies]: Icompany;
  [Entities.assistant]: IAssistant;
  [Entities.rules]: IRules;
  [Entities.knowledge]: IKnowledge;
};

export interface ISystemPrompt {
  currentSystemPrompt: string;
}

export interface ISettings {
  currentBussinesName: string | null;
  currentAssistantName: string | null;
  currentRulesName: string | null;
  currentKnowledgeName: string | null;
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

export interface IKnowledge {
  title: string;
  features: IOptionTextItem[];
}

interface IEntity {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
  softDeletedAt: Date;
  reactivatedAt: Date;
}

export interface IKnowledgeEntity extends IKnowledge, IEntity {}

export interface ISystemPromptEntity extends ISystemPrompt, IEntity {}

export interface ISettingsEntity extends ISettings, IEntity {}

export interface IcompanyEntity extends Icompany, IEntity {}

export interface IAssistantEntity extends IAssistant, IEntity {}

export interface IRulesEntity extends IRules, IEntity {}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
