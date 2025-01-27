// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** components
import EditViewContainer from 'components/componentsSystemPrompts/commonComponents/editView/EditViewContainer';
import MainViewContainer from 'components/componentsSystemPrompts/commonComponents/mainView/MainViewContainer';

// ** Types
import { PromptComponentsEnum } from 'types';

const AssistantView = () => {
  const { mode } = useAssistantContext();

  if (mode === 'main') {
    return <MainViewContainer promptComponentType={PromptComponentsEnum.ASSISTANT} />;
  }

  if (mode === 'edit') {
    return <EditViewContainer promptComponentType={PromptComponentsEnum.ASSISTANT} />;
  } else return <div>Modo no definido</div>;
};

export default AssistantView;
