import { useCompanyContext } from 'contexts/CompanyProvider';
import { IService } from 'types';

const useServices = () => {
  const { tempCompanyServices, setTempCompanyServices } = useCompanyContext();

  const addCompanyService = (service: IService) => {
    setTempCompanyServices((prev) => [...prev, service]);
  };

  const moveUpCompanyServices = (index: number) => {
    if (index === 0) return;
    const updated = [...tempCompanyServices];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempCompanyServices(updated);
  };

  const moveDownCompanyServices = (index: number) => {
    if (index === tempCompanyServices.length - 1) return;
    const updated = [...tempCompanyServices];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempCompanyServices(updated);
  };

  const deleteService = (index: number) => {
    const updated = [...tempCompanyServices];
    updated.splice(index, 1);
    setTempCompanyServices(updated);
  };

  return { addCompanyService, moveUpCompanyServices, moveDownCompanyServices, deleteService };
};

export default useServices;
