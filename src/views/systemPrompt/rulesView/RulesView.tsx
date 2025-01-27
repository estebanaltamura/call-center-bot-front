// ** components
import EditViewContainer from 'components/componentsSystemPrompts/commonComponents/editView/EditViewContainer';
import MainViewContainer from 'components/componentsSystemPrompts/commonComponents/mainView/MainViewContainer';

// ** Context
import { useRulesContext } from 'contexts/RulesProvider';

// ** Types
import { PromptComponentsEnum } from 'types';

const RulesView = () => {
  const { mode } = useRulesContext();

  if (mode === 'main') {
    return <MainViewContainer promptComponentType={PromptComponentsEnum.RULE} />;
  }

  if (mode === 'edit') {
    return <EditViewContainer promptComponentType={PromptComponentsEnum.RULE} />;
  } else return <div>Modo no definido</div>;
};

export default RulesView;
