import { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAssistantContext } from './AssistantProvider';
import { useBusinessContext } from './BusinessProvider';
import { useHatContext } from './HatProvider';
import { useKnowledgeContext } from './KnowledgeProvider';
import { useRulesContext } from './RulesProvider';

interface ILoading {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
// ** Context
const RefreshModeContext = createContext<ILoading | undefined>(undefined);

export const useRefreshModeContext = () => {
  const context = useContext(RefreshModeContext);
  if (!context) {
    throw new Error('useRefreshModeContext debe usarse dentro de un RefreshModeProvider');
  }
  return context;
};

const RefreshModeProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  // ** States
  const { setMode: setBusinessMode } = useBusinessContext();
  const { setMode: setAssistantMode } = useAssistantContext();
  const { setMode: setKnowledgeMode } = useKnowledgeContext();
  const { setMode: setRulesMode } = useRulesContext();
  const { setMode: setHatMode } = useHatContext();

  useEffect(() => {
    setBusinessMode('main');
    setAssistantMode('main');
    setKnowledgeMode('main');
    setRulesMode('main');
    setHatMode('main');
  }, [location]); // Ejecutar cada vez que el path cambie

  return <>{children}</>;
};

export default RefreshModeProvider;
