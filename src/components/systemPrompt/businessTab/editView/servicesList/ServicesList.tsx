// ** Context
import { useBusinessContext } from 'contexts/BusinessProvider';
import { useState } from 'react';

// ** 3rd library
import { v4 as uuidv4 } from 'uuid';

// ** Components
import ServiceListRegularItem from './ServiceListRegularItem';
import ServiceListEditItem from './ServiceListEditItem';
import { IService } from 'types';
import Typo from 'components/general/Typo';

const ServicesList = () => {
  const { tempBusinessServices } = useBusinessContext();
  const [isEditing, setIsEditing] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<IService>();

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <div className="flex flex-col border border-black rounded">
        <div className="relative bg-blue-600 flex h-[40px] justify-center items-center rounded-t">
          <Typo type="body1Semibold" style={{ color: 'white' }}>
            SERVICIOS
          </Typo>
        </div>

        {tempBusinessServices.length === 0 && (
          <div className="flex w-full justify-center">No hay servicios agregados</div>
        )}

        <div className="p-4 space-y-2">
          {isEditing && serviceToEdit && (
            <div className="relative  border-[2px] rounded p-4 border-gray-500">
              <div className="absolute top-0 left-0 w-full h-[40px] bg-blue-600 text-white text-center font-semibold flex items-center justify-center rounded-t-sm">
                MODO EDICION
              </div>
              <ServiceListEditItem service={serviceToEdit} setIsEditing={setIsEditing} index={0} />
            </div>
          )}

          {!isEditing &&
            tempBusinessServices.map((service, index) => {
              const tempCompanyServicesLength = tempBusinessServices.length;

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
    </div>
  );
};

export default ServicesList;
