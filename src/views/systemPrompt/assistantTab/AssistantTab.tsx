// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** components
import MainViewContainer from 'components/systemPrompt/assistantTab/mainView/MainViewContainer';
import EditViewContainer from 'components/systemPrompt/assistantTab/editView/EditViewContainer';

const AssistantTab = () => {
  const { mode } = useAssistantContext();

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default AssistantTab;
