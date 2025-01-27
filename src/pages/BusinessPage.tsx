// ** Context

import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import BusinessView from 'views/systemPrompt/businessView/BusinessView';

const BusinessPage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {/* Contenido */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <BusinessView />
        </div>
      )}
    </div>
  );
};

export default BusinessPage;
