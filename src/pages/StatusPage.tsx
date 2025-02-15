import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import StatusView from 'views/status/StatusView';

const StatusPage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {/* Contenido */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <StatusView />
        </div>
      )}
    </div>
  );
};

export default StatusPage;
