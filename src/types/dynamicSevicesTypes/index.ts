import { IService } from 'contexts/SystemPromptProvider';

export enum Entities {
  'systemPrompts' = 'systemPrompts',
}

export type EntityTypesMapReturnedValues = {
  [Entities.systemPrompts]: ISystemPromptEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.systemPrompts]: ISystemPrompt;
};

export interface ISystemPromptEntity extends ISystemPrompt {
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
}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
