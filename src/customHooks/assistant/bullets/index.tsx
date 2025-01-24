import { useAssistantContext } from 'contexts/AssistantProvider';

const useAssistantBulletFunctions = () => {
  const { tempAssistantData, setTempAssistantData } = useAssistantContext();
  const addAssistantBullet = (option: string, text: string) => {
    const newItem = { option, text };
    setTempAssistantData([...tempAssistantData, newItem]);
  };

  const deleteAssistantBullet = (index: number) => {
    const updated = [...tempAssistantData];
    updated.splice(index, 1);
    setTempAssistantData(updated);
  };

  const moveUpAssistantBullet = (index: number) => {
    if (index === 0) return;
    const updated = [...tempAssistantData];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempAssistantData(updated);
  };

  const moveDownAssistantBullet = (index: number) => {
    if (index === tempAssistantData.length - 1) return;
    const updated = [...tempAssistantData];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempAssistantData(updated);
  };

  return {
    addAssistantBullet,
    deleteAssistantBullet,
    moveUpAssistantBullet,
    moveDownAssistantBullet,
  };
};

export default useAssistantBulletFunctions;
