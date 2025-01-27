// ** components
import EditViewContainer from 'components/systemPrompt/commonComponents/editView/EditViewContainer';
import MainViewContainer from 'components/systemPrompt/rulesTab/MainViewContainer';

// ** Context
import { useRulesContext } from 'contexts/RulesProvider';

// ** Types
import { PromptComponentsEnum } from 'types';

const RulesTab = () => {
  const { mode } = useRulesContext();

  if (mode === 'main') {
    return <MainViewContainer />;
  }

  if (mode === 'edit') {
    return <EditViewContainer promptComponentType={PromptComponentsEnum.RULE} />;
  } else return <div>Modo no definido</div>;
};

export default RulesTab;
