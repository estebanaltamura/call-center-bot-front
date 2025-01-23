// ** Context
import { useAssistantContext } from 'contexts/AssistantProvider';

// ** components
import MainViewContainer from 'components/assistantTab/mainView/MainViewContainer';
import EditViewContainer from 'components/assistantTab/editView/EditViewContainer';

const AssistantTab = () => {
  const { mode } = useAssistantContext();

  //Sirve para generar documentos en firestore con cadenas de texto deinidas por el usuario que tambien se indica en que orden van a ser concatenadas
  //Se pueden crear multiples documentos

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default AssistantTab;
