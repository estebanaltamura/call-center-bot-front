// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** components
import PromptSystemEditViewContainer from 'components/bussinessTab/editView/EditViewContainer';
import SystemPromptMainViewContainer from 'components/bussinessTab/mainView/MainViewContainer';

const BussinesTab = () => {
  const { mode } = useCompanyContext();

  //Sirve para generar documentos en firestore con cadenas de texto deinidas por el usuario que tambien se indica en que orden van a ser concatenadas
  //Se pueden crear multiples documentos

  if (mode === 'main') {
    return <SystemPromptMainViewContainer />;
  }

  if (mode === 'edit') {
    return <PromptSystemEditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default BussinesTab;
