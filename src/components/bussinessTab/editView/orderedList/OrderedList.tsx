// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

// ** Context
import { useCompanyContext } from 'contexts/CompanyProvider';

// ** Components
import Typo from 'components/general/Typo';
import ServicesList from '../servicesList/ServicesList';
import CompanyInformationList from '../companyInformationList/CompanyInformationList';

const OrderedList = () => {
  const { tempCompanyInformation, tempCompanyServices } = useCompanyContext();

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">Ordenamiento</h2>

      <div className="space-y-2">
        <>
          {tempCompanyInformation && tempCompanyInformation.length > 0 && (
            <div key={uuidv4()} className="flex flex-col border border-black rounded-b">
              <div className="relative bg-[#3b82f6]  flex h-[73px] justify-center items-center rounded-t">
                <Typo type="title2Semibold">INFORMACION DE LA EMPRESA</Typo>
              </div>
              <CompanyInformationList />
            </div>
          )}

          {tempCompanyServices && tempCompanyServices.length > 0 && (
            <div key={uuidv4()} className="flex flex-col border border-black rounded">
              <div className="relative bg-[#3b82f6]  flex h-[73px] justify-center items-center rounded-t">
                <Typo type="title2Semibold">SERVICIOS</Typo>
              </div>
              <ServicesList />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default OrderedList;
