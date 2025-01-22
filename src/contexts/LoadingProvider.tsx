import { createContext, useContext, useState } from 'react';

interface ILoading {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
// ** Context
const LoadingContext = createContext<ILoading | undefined>(undefined);

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext debe usarse dentro de un LoadingProvider');
  }
  return context;
};

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  // ** States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return <LoadingContext.Provider value={{ isLoading, setIsLoading }}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;
