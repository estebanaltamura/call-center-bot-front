import { useBusinessContext } from 'contexts/BusinessProvider';
import { IService } from 'types';

const useServices = () => {
  const { tempCompanyServices, setTempCompanyServices } = useBusinessContext();

  const addService = (service: IService) => {
    setTempCompanyServices((prev) => [...prev, service]);
  };

  const moveUpService = (index: number) => {
    if (index === 0) return;
    const updated = [...tempCompanyServices];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempCompanyServices(updated);
  };

  const moveDownService = (index: number) => {
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

  return { addService, moveUpService, moveDownService, deleteService };
};

export default useServices;
