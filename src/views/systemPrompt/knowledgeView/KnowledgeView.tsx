// ** Context
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';

// ** components
import MainViewContainer from 'components/componentsSystemPrompts/commonComponents/mainView/MainViewContainer';
import EditViewContainer from 'components/componentsSystemPrompts/commonComponents/editView/EditViewContainer';

// ** Types
import { PromptComponentsEnum } from 'types';

const KnowledgeView = () => {
  const { mode } = useKnowledgeContext();

  if (mode === 'main') {
    return <MainViewContainer promptComponentType={PromptComponentsEnum.KNOWLEDGE} />;
  }

  if (mode === 'edit') {
    return <EditViewContainer promptComponentType={PromptComponentsEnum.KNOWLEDGE} />;
  } else return <div>Modo no definido</div>;
};

export default KnowledgeView;
