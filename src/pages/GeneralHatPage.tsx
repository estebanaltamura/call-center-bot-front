// ** Context

import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import BusinessView from 'views/systemPrompt/businessView/BusinessView';
import GeneralHatView from 'views/systemPrompt/generalHatView/GeneralHatView';

const GeneralHatPage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {/* Contenido */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <GeneralHatView />
        </div>
      )}
    </div>
  );
};

export default GeneralHatPage;
