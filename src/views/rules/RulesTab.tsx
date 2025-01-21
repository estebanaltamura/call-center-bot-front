// ** Context
import EditViewContainer from 'components/rulesTab/editView/EditViewContainer';
import MainViewContainer from 'components/rulesTab/mainView/MainViewContainer';
import { useCompanyContext } from 'contexts/CompanyProvider';
import { useRulesContext } from 'contexts/RulesProvider';

// ** components

const RulesTab = () => {
  const { mode } = useRulesContext();

  //Sirve para generar documentos en firestore con cadenas de texto deinidas por el usuario que tambien se indica en que orden van a ser concatenadas
  //Se pueden crear multiples documentos

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default RulesTab;
