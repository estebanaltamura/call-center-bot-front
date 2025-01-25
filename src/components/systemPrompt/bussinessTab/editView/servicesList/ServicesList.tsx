// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';
import { useState } from 'react';

// ** 3rd library
import { v4 as uuidv4 } from 'uuid';

// ** Components
import ServiceListRegularItem from './ServiceListRegularItem';
import ServiceListEditItem from './ServiceListEditItem';
import { IService } from 'types';

const ServicesList = () => {
  const { tempCompanyServices } = useCompanyContext();
  const [isEditing, setIsEditing] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<IService>();

  return (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      {tempCompanyServices.length === 0 && (
        <div className="flex w-full justify-center">No hay servicios agregados</div>
      )}

      <div className="space-y-2">
        {isEditing && serviceToEdit && (
          <div className="relative border-gray-500 border-[2px] rounded p-4">
            <div className="absolute top-0 left-0 w-full h-[40px] bg-blue-600 text-white text-center font-semibold flex items-center justify-center rounded-t-sm">
              MODO EDICION
            </div>
            <ServiceListEditItem service={serviceToEdit} setIsEditing={setIsEditing} index={0} />
          </div>
        )}

        {!isEditing &&
          tempCompanyServices.map((service, index) => {
            const tempCompanyServicesLength = tempCompanyServices.length;

            return (
              <div key={uuidv4()} className="relative bg-white  border-[1px]  rounded p-4 flex flex-col">
                {!isEditing && (
                  <ServiceListRegularItem
                    service={service}
                    setIsEditing={setIsEditing}
                    index={index}
                    tempCompanyServicesLength={tempCompanyServicesLength}
                    setServiceToEdit={setServiceToEdit}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ServicesList;
