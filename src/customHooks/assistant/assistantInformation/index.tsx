import { useAssistantContext } from 'contexts/AssistantProvider';

const useAssistantInformation = () => {
  const { tempAssistantInformation, setTempAssistantInformation } = useAssistantContext();
  const addAssistantInformationItem = (option: string, text: string) => {
    const newItem = { option, text };
    setTempAssistantInformation([...tempAssistantInformation, newItem]);
  };

  const deleteAssistantInformationItem = (index: number) => {
    const updated = [...tempAssistantInformation];
    updated.splice(index, 1);
    setTempAssistantInformation(updated);
  };

  const moveUpAssistantInformationItem = (index: number) => {
    console.log(index);
    if (index === 0) return;
    const updated = [...tempAssistantInformation];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempAssistantInformation(updated);
  };

  const moveDownAssistantInformationItem = (index: number) => {
    if (index === tempAssistantInformation.length - 1) return;
    const updated = [...tempAssistantInformation];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempAssistantInformation(updated);
  };

  return {
    addAssistantInformationItem,
    deleteAssistantInformationItem,
    moveUpAssistantInformationItem,
    moveDownAssistantInformationItem,
  };
};

export default useAssistantInformation;
