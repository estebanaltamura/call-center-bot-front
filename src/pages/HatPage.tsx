// ** Context

import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import GeneralHatView from 'views/systemPrompt/generalHatView/GeneralHatView';

const HatPage = () => {
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

export default HatPage;
