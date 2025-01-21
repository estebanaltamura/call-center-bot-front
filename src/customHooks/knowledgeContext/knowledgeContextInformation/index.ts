import { useKnowledgeContextContext } from 'contexts/KnoledgeProvider';

const useKnowledgeContextInformation = () => {
  const { tempKnowledgeContextInformation, setTempKnowledgeContextInformation } =
    useKnowledgeContextContext();
  const addKnowledgeContextInformationItem = (option: string, text: string) => {
    const newItem = { option, text };
    setTempKnowledgeContextInformation([...tempKnowledgeContextInformation, newItem]);
  };

  const deleteKnowledgeContextInformationItem = (index: number) => {
    const updated = [...tempKnowledgeContextInformation];
    updated.splice(index, 1);
    setTempKnowledgeContextInformation(updated);
  };

  const moveUpKnowledgeContextInformationItem = (index: number) => {
    console.log(index);
    if (index === 0) return;
    const updated = [...tempKnowledgeContextInformation];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempKnowledgeContextInformation(updated);
  };

  const moveDownKnowledgeContextInformationItem = (index: number) => {
    if (index === tempKnowledgeContextInformation.length - 1) return;
    const updated = [...tempKnowledgeContextInformation];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempKnowledgeContextInformation(updated);
  };

  return {
    addKnowledgeContextInformationItem,
    deleteKnowledgeContextInformationItem,
    moveUpKnowledgeContextInformationItem,
    moveDownKnowledgeContextInformationItem,
  };
};

export default useKnowledgeContextInformation;
