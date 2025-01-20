// ** Types
import { IOptionTextItem, IService } from 'types';

export enum Entities {
  'systemPrompts' = 'systemPrompts',
  'settings' = 'settings',
  'companies' = 'companies',
}

export type EntityTypesMapReturnedValues = {
  [Entities.systemPrompts]: ISystemPromptEntity;
  [Entities.settings]: ISettingsEntity;
  [Entities.companies]: IcompanyEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.systemPrompts]: ISystemPrompt;
  [Entities.settings]: ISettings;
  [Entities.companies]: Icompany;
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

export interface ISystemPrompt {
  title: string;
  bullets: string[];
  services: IService[];
  prompt: string;
  servicesOrderIndex: number;
}

export interface ISettings {
  currentBussinesName: string;
}

export interface Icompany {
  title: string;
  features: IOptionTextItem[];
  services: IService[];
  servicesOrderIndex: number;
}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
