// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** 3rd library
import { v4 as uuidv4 } from 'uuid';

// ** Components
import ServiceListItem from './ServiceListItem';

const ServicesList = () => {
  const { tempCompanyServices } = useCompanyContext();

  return (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      {tempCompanyServices.length === 0 && (
        <div className="flex w-full justify-center">No hay servicios agregados</div>
      )}

      <div className="space-y-2">
        {tempCompanyServices.map((service, index) => (
          <ServiceListItem
            key={uuidv4()}
            service={service}
            index={index}
            tempCompanyServicesLength={tempCompanyServices.length}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
