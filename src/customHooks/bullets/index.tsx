// Contexts
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useBusinessContext } from 'contexts/BusinessProvider';
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';
import { useRulesContext } from 'contexts/RulesProvider';

type PromptComponentsType = 'ASSISTANT' | 'RULE' | 'KNOWLEDGE' | 'BUSINESS';
export enum PromptComponentsEnum {
  ASSISTANT = 'ASSISTANT',
  RULE = 'RULE',
  KNOWLEDGE = 'KNOWLEDGE',
  BUSINESS = 'BUSINESS',
}

const useBulletFunctions = (promptComponentType: PromptComponentsType) => {
  console.log(promptComponentType);
  const { tempAssistantData, setTempAssistantData } = useAssistantContext();
  const { tempRulesData, setTempRulesData } = useRulesContext();
  const { tempKnowledgeData, setTempKnowledgeData } = useKnowledgeContext();
  const { tempBusinessData, setTempBusinessData } = useBusinessContext();

  const tempDataMap = {
    ASSISTANT: tempAssistantData,
    RULE: tempRulesData,
    KNOWLEDGE: tempKnowledgeData,
    BUSINESS: tempBusinessData,
  };

  const setTempDataMap = {
    ASSISTANT: setTempAssistantData,
    RULE: setTempRulesData,
    KNOWLEDGE: setTempKnowledgeData,
    BUSINESS: setTempBusinessData,
  };

  const addBullet = (option: string, text: string) => {
    console.log(option, text, promptComponentType);
    const newItem = { option, text };
    setTempDataMap[promptComponentType]([...tempDataMap[promptComponentType], newItem]);
  };

  const deleteBullet = (index: number) => {
    const updated = [...tempDataMap[promptComponentType]];
    updated.splice(index, 1);
    setTempDataMap[promptComponentType](updated);
  };

  const moveUpBullet = (index: number) => {
    if (index === 0) return;
    const updated = [...tempDataMap[promptComponentType]];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempDataMap[promptComponentType](updated);
  };

  const moveDownBullet = (index: number) => {
    if (index === tempDataMap[promptComponentType].length - 1) return;
    const updated = [...tempDataMap[promptComponentType]];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempDataMap[promptComponentType](updated);
  };

  return {
    addBullet,
    moveUpBullet,
    moveDownBullet,
    deleteBullet,
  };
};

export default useBulletFunctions;
