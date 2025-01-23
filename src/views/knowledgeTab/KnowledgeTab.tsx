// ** Context

// ** components

import EditViewContainer from 'components/knowledgeTab/editView/EditViewContainer';
import MainViewContainer from 'components/knowledgeTab/mainView/MainViewContainer';
import { useKnowledgeContextContext } from 'contexts/KnoledgeProvider';

const KnowledgeTab = () => {
  const { mode } = useKnowledgeContextContext();

  //Sirve para generar documentos en firestore con cadenas de texto deinidas por el usuario que tambien se indica en que orden van a ser concatenadas
  //Se pueden crear multiples documentos

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default KnowledgeTab;
