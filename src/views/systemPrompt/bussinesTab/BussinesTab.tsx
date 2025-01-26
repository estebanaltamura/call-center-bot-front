// ** Context
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** components
import MainViewContainer from 'components/systemPrompt/businessTab/mainView/MainViewContainer';
import EditViewContainer from 'components/systemPrompt/businessTab/editView/EditViewContainer';

const BussinesTab = () => {
  const { mode } = useBusinessContext();

  //Sirve para generar documentos en firestore con cadenas de texto deinidas por el usuario que tambien se indica en que orden van a ser concatenadas
  //Se pueden crear multiples documentos

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default BussinesTab;
