// Contexts
import { useAssistantContext } from 'contexts/AssistantProvider';
import { useBusinessContext } from 'contexts/BusinessProvider';
import { useKnowledgeContext } from 'contexts/KnowledgeProvider';
import { useRulesContext } from 'contexts/RulesProvider';

type PromptComponentsType = 'ASSISTANT' | 'RULE' | 'KNOWLEDGE' | 'BUSINESS';

const useBulletFunctions = (promptComponentType: PromptComponentsType) => {
  const { tempBullets: assistantTempBullets, setTempBullets: setAssistantTempBullets } =
    useAssistantContext();
  const { tempBullets: rulesTempBullets, setTempBullets: setRulesTempBullets } = useRulesContext();
  const { tempBullets: knowledgeTempBullets, setTempBullets: setKnowledgeTempBullets } =
    useKnowledgeContext();
  const { tempBullets: businessTempBullets, setTempBullets: setBusinessTempBullets } = useBusinessContext();

  const tempDataMap = {
    ASSISTANT: assistantTempBullets,
    RULE: rulesTempBullets,
    KNOWLEDGE: knowledgeTempBullets,
    BUSINESS: businessTempBullets,
  };

  const setTempDataMap = {
    ASSISTANT: setAssistantTempBullets,
    RULE: setRulesTempBullets,
    KNOWLEDGE: setKnowledgeTempBullets,
    BUSINESS: setBusinessTempBullets,
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
