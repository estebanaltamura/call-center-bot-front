import { createContext, useState } from 'react';

// Definición de tipos
export type FieldType = 'string' | 'number' | 'boolean' | 'date';

export interface Field {
  name: string;
  type: FieldType;
}

export interface Goal {
  prompt: string;
  fields: Field[];
}

// Valor inicial del contexto
const GoalsContextInitialValue: {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
} = {
  goals: [],
  setGoals: () => [], // Placeholder para evitar errores si se usa fuera del provider
};

// Creación del contexto
export const GoalsContext = createContext(GoalsContextInitialValue);

const GoalsProvider = ({ children }: { children: React.ReactNode }) => {
  // Lista de Goals creados
  const [goals, setGoals] = useState<Goal[]>([]);

  return <GoalsContext.Provider value={{ goals, setGoals }}>{children}</GoalsContext.Provider>;
};

export default GoalsProvider;
