// ** Context
import { useKnowledgeContextContext } from 'contexts/KnoledgeProvider';

// ** components
import EditViewContainer from 'components/knowledgeTab/editView/EditViewContainer';
import MainViewContainer from 'components/knowledgeTab/mainView/MainViewContainer';

const KnowledgeTab = () => {
  const { mode } = useKnowledgeContextContext();

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default KnowledgeTab;
