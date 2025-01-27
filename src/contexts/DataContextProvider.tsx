// DataContext.tsx
import React, { createContext, useContext } from 'react';

// Importamos los cuatro contextos
import { AssistantProvider, useAssistantContext } from 'contexts/AssistantProvider';
import { BusinessProvider, useBusinessContext } from 'contexts/BusinessProvider';
import { KnowledgeProvider, useKnowledgeContext } from 'contexts/KnowledgeProvider';
import { RulesProvider, useRulesContext } from 'contexts/RulesProvider';
import { PromptComponentsEnum } from 'types';

// Enum para definir los contextos disponibles

// Interfaz que define todos los contextos
interface IDataContext {
  assistant: ReturnType<typeof useAssistantContext>;
  business: ReturnType<typeof useBusinessContext>;
  knowledge: ReturnType<typeof useKnowledgeContext>;
  rules: ReturnType<typeof useRulesContext>;
}

// Creación del contexto unificado
const DataContext = createContext<IDataContext | undefined>(undefined);

// Componente que envuelve los cuatro contextos y crea un solo proveedor
const DataContextWrapper = ({ children }: { children: React.ReactNode }) => {
  const assistant = useAssistantContext();
  const business = useBusinessContext();
  const knowledge = useKnowledgeContext();
  const rules = useRulesContext();

  const value: IDataContext = {
    assistant,
    business,
    knowledge,
    rules,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Proveedor principal que anida todos los subcontextos y expone el contexto unificado
export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AssistantProvider>
      <BusinessProvider>
        <KnowledgeProvider>
          <RulesProvider>
            <DataContextWrapper>{children}</DataContextWrapper>
          </RulesProvider>
        </KnowledgeProvider>
      </BusinessProvider>
    </AssistantProvider>
  );
};

// Hook para acceder a un subcontexto específico
export const useDataContext = <T extends PromptComponentsEnum>(
  definedContext: T,
): T extends PromptComponentsEnum.ASSISTANT
  ? ReturnType<typeof useAssistantContext>
  : T extends PromptComponentsEnum.RULE
  ? ReturnType<typeof useRulesContext>
  : T extends PromptComponentsEnum.BUSINESS
  ? ReturnType<typeof useBusinessContext>
  : T extends PromptComponentsEnum.KNOWLEDGE
  ? ReturnType<typeof useKnowledgeContext>
  : never => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext debe usarse dentro de DataProvider.');
  }

  // Retorna el subcontexto correspondiente según el valor de `definedContext`
  switch (definedContext) {
    case PromptComponentsEnum.ASSISTANT:
      return context.assistant as any;
    case PromptComponentsEnum.RULE:
      return context.rules as any;
    case PromptComponentsEnum.BUSINESS:
      return context.business as any;
    case PromptComponentsEnum.KNOWLEDGE:
      return context.knowledge as any;
    default:
      throw new Error(`Contexto no definido: ${definedContext}`);
  }
};
