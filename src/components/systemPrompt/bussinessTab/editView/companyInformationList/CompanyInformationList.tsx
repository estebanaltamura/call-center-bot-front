// ** InformationList.tsx
import { v4 as uuidv4 } from 'uuid';
import { useCompanyContext } from 'contexts/CompanyProvider';
import CompanyInformationListItem from './CompanyInformationListItem';

const CompanyInformationList = () => {
  const { tempCompanyInformation } = useCompanyContext();

  return (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      {tempCompanyInformation.length === 0 && (
        <div className="flex w-full justify-center">No hay información de la empresa</div>
      )}

      <div className="space-y-2">
        {tempCompanyInformation.map((infoItem, index) => (
          <CompanyInformationListItem
            key={uuidv4()}
            infoItem={infoItem}
            index={index}
            tempCompanyInformationLength={tempCompanyInformation.length}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyInformationList;
