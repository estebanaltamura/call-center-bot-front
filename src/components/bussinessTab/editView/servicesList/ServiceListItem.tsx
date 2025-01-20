// ** React
import { useState } from 'react';

// ** Types
import { IService } from 'types';

// ** Components
import ServiceListEditItem from './ServiceListEditItem';
import ServiceListRegularItem from './ServiceListRegularItem';

const ServiceListItem = ({
  service,
  index,
  tempCompanyServicesLength,
}: {
  service: IService;
  index: number;
  tempCompanyServicesLength: number;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className={`relative bg-white  ${
        isEditing ? 'border-gray-500 border-[2px]' : 'border-[1px]'
      }  rounded p-4 flex flex-col`}
    >
      {isEditing && (
        <div className="absolute top-0 left-0 w-full h-[40px] bg-blue-600 text-white text-center font-semibold flex items-center justify-center rounded-t-sm">
          MODO EDICION
        </div>
      )}

      {!isEditing && (
        <ServiceListRegularItem
          service={service}
          setIsEditing={setIsEditing}
          index={index}
          tempCompanyServicesLength={tempCompanyServicesLength}
        />
      )}

      {isEditing && <ServiceListEditItem service={service} setIsEditing={setIsEditing} index={index} />}
    </div>
  );
};

export default ServiceListItem;
