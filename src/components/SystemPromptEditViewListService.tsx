// SystemPromptEditViewListService.tsx
import { FC, useState, useRef } from 'react';
import { useSystemPromptContext } from 'contexts/SystemPromptProvider';

interface Service {
  title: string;
  description: string;
  requirements: string[];
}

const SystemPromptEditViewListService: FC<{
  service: Service;
  index: number;
  length: number;
}> = ({ service, index, length }) => {
  const { deleteService, moveUpServices, moveDownServices } = useSystemPromptContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="relative bg-white border rounded p-2 flex flex-col">
      <div className="flex justify-between items-center mb-2">
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

      <div
        ref={containerRef}
        className={`
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[600px] overflow-auto' : 'max-h-[40px] overflow-hidden'}
        `}
      >
        <p className="mt-2">{service.description}</p>
        {service.requirements && service.requirements.length > 0 && (
          <ul className="list-disc ml-5 mt-2">
            {service.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={toggleExpand} className="text-gray-500 hover:text-black flex items-center">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
};

export default SystemPromptEditViewListService;
