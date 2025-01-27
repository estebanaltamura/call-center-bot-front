// ** Context
import { useBusinessContext } from 'contexts/BusinessProvider';

// ** components
import EditViewContainer from 'components/componentsSystemPrompts/commonComponents/editView/EditViewContainer';
import MainViewContainer from 'components/componentsSystemPrompts/commonComponents/mainView/MainViewContainer';

// ** Types
import { PromptComponentsEnum } from 'types';

const BusinessView = () => {
  const { mode } = useBusinessContext();

  //Sirve para generar documentos en firestore con cadenas de texto deinidas por el usuario que tambien se indica en que orden van a ser concatenadas
  //Se pueden crear multiples documentos

  if (mode === 'main') {
    return <MainViewContainer promptComponentType={PromptComponentsEnum.BUSINESS} />;
  }

  if (mode === 'edit') {
    return <EditViewContainer promptComponentType={PromptComponentsEnum.BUSINESS} />;
  } else return <div>Modo no definido</div>;
};

export default BusinessView;
