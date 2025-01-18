import { v4 as uuidv4 } from 'uuid';
import { IService } from 'types';
import { useSystemPromptContext } from 'contexts/SystemPromptsProvider';
import { useRef } from 'react';
import { useState } from 'react';

const ServicesList = () => {
  const { tempServices } = useSystemPromptContext();
  const { deleteService, moveUpServices, moveDownServices } = useSystemPromptContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      {tempServices.length === 0 && (
        <div className="flex w-full justify-center">No hay servicios agregados</div>
      )}

      <div className="space-y-2">
        {tempServices.map((service, index) => (
          <div className="relative bg-white border rounded p-2 flex flex-col" key={index}>
            <div className="relative bg-white border rounded px-2 flex h-[45px] justify-first items-center">
              <span className="font-bold">
                {service.title}
                {index}
                {tempServices.length - 1}
              </span>
              <div className="absolute right-2 flex items-center justify-center gap-2">
                <button
                  disabled={index === tempServices.length - 1}
                  onClick={() => {
                    setIsExpanded(false);
                    moveDownServices(index);
                  }}
                  className={`${
                    index === tempServices.length - 1 ? 'bg-gray-400' : 'bg-gray-200'
                  } px-2 rounded w-[35px] h-[35px]`}
                >
                  ↓
                </button>

                <button
                  disabled={index === 0}
                  onClick={() => {
                    setIsExpanded(false);
                    moveUpServices(index);
                  }}
                  className={`${index === 0 ? 'bg-gray-400' : 'bg-gray-200'} px-2 rounded w-[35px] h-[35px]`}
                >
                  ↑
                </button>

                <button
                  onClick={() => deleteService(index)}
                  className="bg-red-600 px-2 rounded w-[35px] h-[35px] flex items-center justify-center"
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
