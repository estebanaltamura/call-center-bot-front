import { useCompanyContext } from 'contexts/CompanyProvider';

const useCompanyInformation = () => {
  const { tempCompanyInformation, setTempCompanyInformation } = useCompanyContext();
  const addCompanyInformationItem = (option: string, text: string) => {
    const newItem = { option, text };
    setTempCompanyInformation([...tempCompanyInformation, newItem]);
  };

  const deleteCompanyInformationItem = (index: number) => {
    const updated = [...tempCompanyInformation];
    updated.splice(index, 1);
    setTempCompanyInformation(updated);
  };

  const moveUpCompanyInformationItem = (index: number) => {
    if (index === 0) return;
    const updated = [...tempCompanyInformation];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempCompanyInformation(updated);
  };

  const moveDownCompanyInformationItem = (index: number) => {
    if (index === tempCompanyInformation.length - 1) return;
    const updated = [...tempCompanyInformation];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempCompanyInformation(updated);
  };

  return {
    addCompanyInformationItem,
    deleteCompanyInformationItem,
    moveUpCompanyInformationItem,
    moveDownCompanyInformationItem,
  };
};

export default useCompanyInformation;
