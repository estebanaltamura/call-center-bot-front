// ** Context

import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import HatView from 'views/systemPrompt/generalHatView/HatView';
import DashboardView from 'views/dashboard/DashboardView';

const DashboardPage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {/* Contenido */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <DashboardView />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
