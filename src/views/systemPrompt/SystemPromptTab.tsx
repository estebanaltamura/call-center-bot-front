// ** Context import
import { useSystemPromptContext } from 'contexts/SystemPromptProvider';

// ** components import
import PromptSystemEditViewContainer from 'components/SystemPromptEditViewContainer';
import SystemPromptGeneralViewContainer from 'components/SystemPromptGeneralViewContainer';

const SystemPromptTab = () => {
  const { mode } = useSystemPromptContext();

  //Sirve para generar documentos en firestore con cadenas de texto deinidas por el usuario que tambien se indica en que orden van a ser concatenadas
  //Se pueden crear multiples documentos

  if (mode === 'general') {
    return <SystemPromptGeneralViewContainer />;
  }

  return <PromptSystemEditViewContainer />;
};

export default SystemPromptTab;
