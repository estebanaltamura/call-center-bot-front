import { useCompanyContext } from 'contexts/CompanyProvider';
import { serviceOptions } from 'enums/systemPrompts';
import { useState, useRef } from 'react';
import { IService, IOptionTextItem } from 'types';
import { v4 as uuidv4 } from 'uuid';

const ServiceListItem = ({
  service,
  index,
  tempCompanyServicesLength,
}: {
  service: IService;
  index: number;
  tempCompanyServicesLength: number;
}) => {
  const { deleteService, moveUpCompanyServices, moveDownCompanyServices, setTempCompanyServices } =
    useCompanyContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [tempTitle, setTempTitle] = useState(service.title);
  const [tempDescription, setTempDescription] = useState(service.description);
  const [tempItems, setTempItems] = useState<IOptionTextItem[]>(service.items || []);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setTempTitle(service.title);
    setTempDescription(service.description);
    setTempItems(service.items);
    setIsEditing(false);
    setIsExpanded(false);
  };

  const handleConfirmEdit = () => {
    setTempCompanyServices((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        title: tempTitle,
        description: tempDescription,
        items: tempItems,
      };
      return updated;
    });
    setIsExpanded(false);
    setIsEditing(false);
  };

  const handleAddNewItem = () => {
    setTempItems((prev) => [...prev, { option: '', text: '' }]);
  };

  return (
    <div className="relative bg-white border rounded p-2 flex flex-col">
      {!isEditing && (
        <div className="relative bg-white flex h-[45px] justify-first items-center">
          <span className="font-bold border rounded flex-grow p-2">{service.title}</span>

          <div className="flex items-center justify-center gap-2 ml-2">
            <button
              disabled={index === tempCompanyServicesLength - 1}
              onClick={() => {
                setIsExpanded(false);
                moveDownCompanyServices(index);
              }}
              className={`${
                index === tempCompanyServicesLength - 1 ? 'bg-gray-400' : 'bg-gray-200'
              } px-2 rounded w-[35px] h-[35px]`}
            >
              ↓
            </button>

            <button
              disabled={index === 0}
              onClick={() => {
                setIsExpanded(false);
                moveUpCompanyServices(index);
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

            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsExpanded(true);
                }}
                className="bg-gray-200 px-2 rounded w-[35px] h-[35px]"
              >
                ✎
              </button>
            )}
          </div>
        </div>
      )}

      {isExpanded && (
        <div
          ref={containerRef}
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-[600px] overflow-auto' : 'max-h-[40px] overflow-hidden'
          }`}
        >
          {isEditing ? (
            <div className="mt-2">
              <div className="mb-2">
                <span className="font-semibold block mb-1">Título</span>
                <input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="border p-1 w-full"
                />
              </div>

              <div className="mb-2">
                <span className="font-semibold block mb-1">Descripción</span>
                <textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  className="border p-1 w-full"
                />
              </div>

              <div className="mt-2">
                {tempItems.map((item, idx) => (
                  <div key={idx} className="mb-4">
                    <span className="font-semibold block mb-1">Característica {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded px-2 py-2 w-1/3"
                        value={item.option}
                        onChange={(e) => {
                          const newItems = [...tempItems];
                          newItems[idx] = { ...newItems[idx], option: e.target.value };
                          setTempItems(newItems);
                        }}
                      >
                        {serviceOptions.map((section) => (
                          <optgroup key={uuidv4()} label={section.label}>
                            {section.options.map((opt) => (
                              <option key={uuidv4()} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>

                      <input
                        className="border p-1 flex-grow"
                        value={item.text}
                        onChange={(e) => {
                          const newItems = [...tempItems];
                          newItems[idx] = { ...newItems[idx], text: e.target.value };
                          setTempItems(newItems);
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button onClick={handleAddNewItem} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Agregar característica
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2">Descripción: {service.description}</p>
              {service.items && service.items.length > 0 && (
                <ul className="list-disc ml-5 mt-2">
                  {service.items.map((item) => (
                    <li key={uuidv4()}>
                      {item.option}: {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-end min-h-6 mt-2">
        {isEditing && (
          <>
            <button onClick={handleConfirmEdit} className="bg-green-500 px-2 rounded w-[35px] h-[35px] mr-2">
              ✓
            </button>
            <button onClick={handleCancelEdit} className="bg-red-600 px-2 rounded w-[35px] h-[35px] mr-2">
              ✕
            </button>
          </>
        )}

        <button
          onClick={toggleExpand}
          className="absolute right-1/2 translate-x-1/2 text-gray-500 hover:text-black flex items-center"
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
};

export default ServiceListItem;
