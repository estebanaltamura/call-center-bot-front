// ** Context
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';

// ** components
import EditViewContainer from 'components/systemPrompt/knowledgeTab/editView/EditViewContainer';
import MainViewContainer from 'components/systemPrompt/knowledgeTab/mainView/MainViewContainer';

const KnowledgeTab = () => {
  const { mode } = useKnowledgeContext();

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default KnowledgeTab;
