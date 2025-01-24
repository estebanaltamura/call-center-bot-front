// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** components
import MainViewContainer from 'components/assistantTab/mainView/MainViewContainer';
import EditViewContainer from 'components/assistantTab/editView/EditViewContainer';

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
