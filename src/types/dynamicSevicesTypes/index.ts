export enum Entities {
  'systemPrompts' = 'systemPrompts',
}

export type EntityTypesMapReturnedValues = {
  [Entities.systemPrompts]: IISystemPromptEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.systemPrompts]: ISystemPrompt;
};

export interface IISystemPromptEntity extends ISystemPrompt {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISystemPrompt {
  title: string;
  prompts: string[];
}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
