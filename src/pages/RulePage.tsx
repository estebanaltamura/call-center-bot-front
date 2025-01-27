import { useLoadingContext } from 'contexts/LoadingProvider';
import Loader from 'components/general/Loader';
import BusinessView from 'views/systemPrompt/businessView/BusinessView';
import RulesView from 'views/systemPrompt/rulesView/RulesView';

const RulePage = () => {
  // Contexts
  const { isLoading } = useLoadingContext();

  return (
    <div className="flex flex-col h-full">
      {/* Contenido */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <RulesView />
        </div>
      )}
    </div>
  );
};

export default RulePage;
