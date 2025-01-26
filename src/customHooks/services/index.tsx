import { useBusinessContext } from 'contexts/BusinessProvider';
import { IOptionTextItem } from 'types';

export interface IService {
  title: string;
  description: string;
  items: IOptionTextItem[];
}

const useServiceFunctions = () => {
  const { tempBusinessServices, setTempBusinessServices } = useBusinessContext();

  const addService = (title: string, description: string, items: IOptionTextItem[]) => {
    const newService: IService = { title, description, items };
    setTempBusinessServices([...tempBusinessServices, newService]);
  };

  const deleteService = (index: number) => {
    const updated = [...tempBusinessServices];
    updated.splice(index, 1);
    setTempBusinessServices(updated);
  };

  const moveUpService = (index: number) => {
    if (index === 0) return;
    const updated = [...tempBusinessServices];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempBusinessServices(updated);
  };

  const moveDownService = (index: number) => {
    if (index === tempBusinessServices.length - 1) return;
    const updated = [...tempBusinessServices];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempBusinessServices(updated);
  };

  return {
    addService,
    deleteService,
    moveUpService,
    moveDownService,
  };
};

export default useServiceFunctions;
