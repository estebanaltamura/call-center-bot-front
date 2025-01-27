import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import BusinessView from 'views/systemPrompt/businessView/BusinessView';
import KnowledgeView from 'views/systemPrompt/knowledgeView/KnowledgeView';

const KnowledgePage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {/* Contenido */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <KnowledgeView />
        </div>
      )}
    </div>
  );
};

export default KnowledgePage;
