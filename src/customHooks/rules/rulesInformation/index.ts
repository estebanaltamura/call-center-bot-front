import { useRulesContext } from 'contexts/RulesProvider';

const useRulesInformation = () => {
  const { tempRulesInformation, setTempRulesInformation } = useRulesContext();
  const addRulesInformationItem = (option: string, text: string) => {
    const newItem = { option, text };
    setTempRulesInformation([...tempRulesInformation, newItem]);
  };

  const deleteRulesInformationItem = (index: number) => {
    const updated = [...tempRulesInformation];
    updated.splice(index, 1);
    setTempRulesInformation(updated);
  };

  const moveUpRulesInformationItem = (index: number) => {
    console.log(index);
    if (index === 0) return;
    const updated = [...tempRulesInformation];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempRulesInformation(updated);
  };

  const moveDownRulesInformationItem = (index: number) => {
    if (index === tempRulesInformation.length - 1) return;
    const updated = [...tempRulesInformation];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempRulesInformation(updated);
  };

  return {
    addRulesInformationItem,
    deleteRulesInformationItem,
    moveUpRulesInformationItem,
    moveDownRulesInformationItem,
  };
};

export default useRulesInformation;
