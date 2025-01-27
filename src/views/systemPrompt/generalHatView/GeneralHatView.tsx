import PromptTab from 'components/hats/promptTab/PromptTab';
import SettingsTab from 'components/hats/settingsTab/SettingsTab';
import GeneralHat from 'pages/GeneralHatPage';

const GeneralHatView = () => {
  return (
    <>
      <SettingsTab />
      <PromptTab />
    </>
  );
};

export default GeneralHatView;
