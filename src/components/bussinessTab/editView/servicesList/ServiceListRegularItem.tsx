// **  React
import { useState } from 'react';

// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

// ** Types
import { IService } from 'types';
import useServices from 'customHooks/company/services';

const ServiceListRegularItem = ({
  service,
  setIsEditing,
  index,
  tempCompanyServicesLength,
}: {
  service: IService;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  tempCompanyServicesLength: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const { deleteService, moveUpCompanyServices, moveDownCompanyServices } = useServices();

  return (
    <>
      <div className="relative bg-white flex h-[40px] justify-first items-center mb-2">
        <p className="font-bold border flex-grow p-2 h-[40px]">{service.title}</p>

        <div className="flex items-center justify-center gap-2 ml-2">
          <button
            disabled={index === tempCompanyServicesLength - 1}
            onClick={() => {
              setIsExpanded(false);
              moveDownCompanyServices(index);
            }}
            className={`${
              index === tempCompanyServicesLength - 1 ? 'bg-gray-400' : 'bg-gray-200'
            } px-2 w-[40px] h-[40px] rounded`}
          >
            ↓
          </button>

          <button
            disabled={index === 0}
            onClick={() => {
              setIsExpanded(false);
              moveUpCompanyServices(index);
            }}
            className={`${index === 0 ? 'bg-gray-400' : 'bg-gray-200'} px-2 w-[40px] h-[40px] rounded`}
          >
            ↑
          </button>

          <button
            onClick={() => {
              setIsEditing(true);
              setIsExpanded(true);
            }}
            className="bg-gray-200 px-2 w-[40px] h-[40px] rounded text-xl"
          >
            ✎
          </button>

          <button
            onClick={() => deleteService(index)}
            className="bg-red-600 px-2 w-[40px] h-[40px] flex items-center justify-center rounded"
          >
            🗑️
          </button>
        </div>
      </div>
      <button
        onClick={toggleExpand}
        className="absolute bottom-0 right-1/2 translate-x-1/2 text-black flex items-center"
      >
        {isExpanded ? '▲' : '▼'}
      </button>
      {isExpanded && (
        <div className="pl-2">
          <p>Descripción: {service.description}</p>
          {service.items && service.items.length > 0 && (
            <ul className="list-disc ml-5 mt-2">
              {service.items.map((item) => (
                <li key={uuidv4()}>
                  {item.option} {item.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default ServiceListRegularItem;
