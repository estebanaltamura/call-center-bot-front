// ** Types
import { IService } from 'types';

export enum Entities {
  'systemPrompts' = 'systemPrompts',
  'settings' = 'settings',
}

export type EntityTypesMapReturnedValues = {
  [Entities.systemPrompts]: ISystemPromptEntity;
  [Entities.settings]: ISettingsEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.systemPrompts]: ISystemPrompt;
  [Entities.settings]: ISettings;
};

export interface ISystemPromptEntity extends ISystemPrompt {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISettingsEntity extends ISettings {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISystemPrompt {
  title: string;
  bullets: string[];
  services: IService[];
  prompt: string;
  servicesOrderIndex: number;
}

export interface ISettings {
  currentPromptTitle: string;
}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
