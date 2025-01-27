// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** components
import MainViewContainer from 'components/systemPrompt/assistantTab/MainViewContainer';
import EditViewContainer from 'components/systemPrompt/commonComponents/editView/EditViewContainer';

// ** Types
import { PromptComponentsEnum } from 'types';

const AssistantTab = () => {
  const { mode } = useAssistantContext();

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer promptComponentType={PromptComponentsEnum.ASSISTANT} />;
  } else return <div>Modo no definido</div>;
};

export default AssistantTab;
