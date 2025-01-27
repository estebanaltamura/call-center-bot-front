// ** Context
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';

// ** components
import MainViewContainer from 'components/systemPrompt/knowledgeTab/MainViewContainer';
import EditViewContainer from 'components/systemPrompt/commonComponents/editView/EditViewContainer';

// ** Types
import { PromptComponentsEnum } from 'types';

const KnowledgeTab = () => {
  const { mode } = useKnowledgeContext();

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer promptComponentType={PromptComponentsEnum.KNOWLEDGE} />;
  } else return <div>Modo no definido</div>;
};

export default KnowledgeTab;
