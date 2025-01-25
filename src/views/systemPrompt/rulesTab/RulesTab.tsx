// ** components
import EditViewContainer from 'components/systemPrompt/rulesTab/editView/EditViewContainer';
import MainViewContainer from 'components/systemPrompt/rulesTab/mainView/MainViewContainer';

// ** Context
import { useRulesContext } from 'contexts/RulesProvider';

const RulesTab = () => {
  const { mode } = useRulesContext();

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer />;
  } else return <div>Modo no definido</div>;
};

export default RulesTab;
