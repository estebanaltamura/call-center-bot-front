import { v4 as uuidv4 } from 'uuid';
import { IService } from 'types';
import { useSystemPromptContext } from 'contexts/SystemPromptsProvider';
import { useRef } from 'react';
import { useState } from 'react';

const ServicesList = ({ tempServices }: { tempServices: IService[] }) => {
  const { deleteService, moveUpServices, moveDownServices } = useSystemPromptContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">Servicios</h2>
      {tempServices.length === 0 && (
        <div className="flex w-full justify-center">No hay servicios agregados</div>
      )}

      <div className="space-y-2">
        {tempServices.map((service, index) => (
          <div className="relative bg-white border rounded p-2 flex flex-col" key={index}>
            <div className="flex justify-between items-center">
              <span className="font-bold">{service.title}</span>
              <div className="flex items-center space-x-1">
                {index > 0 && (
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      moveUpServices(index);
                    }}
                    className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
                  >
                    ↑
                  </button>
                )}
                {index < length - 1 && (
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      moveDownServices(index);
                    }}
                    className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
                  >
                    ↓
                  </button>
                )}
                <button
                  onClick={() => deleteService(index)}
                  className="bg-red-600 text-white px-1 py-1 rounded w-[30px] h-[30px]"
                >
                  🗑️
                </button>
              </div>
            </div>

            {isExpanded && (
              <div
                ref={containerRef}
                className={`
           transition-all duration-300 ease-in-out
           ${isExpanded ? 'max-h-[600px] overflow-auto' : 'max-h-[40px] overflow-hidden'}
         `}
              >
                <p className="mt-2">{service.description}</p>
                {service.items && service.items.length > 0 && (
                  <ul className="list-disc ml-5 mt-2">
                    {service.items.map((item, idx) => (
                      <li key={idx}>
                        {item.option}: {item.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex justify-center">
              <button onClick={toggleExpand} className="text-gray-500 hover:text-black flex items-center">
                {isExpanded ? '▲' : '▼'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
