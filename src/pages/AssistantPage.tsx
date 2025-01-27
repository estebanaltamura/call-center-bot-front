// ** Context

import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import AssistantView from 'views/systemPrompt/assistantView/AssistantView';

const AssistantPage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {/* Contenido */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <AssistantView />
        </div>
      )}
    </div>
  );
};

export default AssistantPage;
