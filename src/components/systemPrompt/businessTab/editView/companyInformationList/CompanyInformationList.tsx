// ** InformationList.tsx
import { v4 as uuidv4 } from 'uuid';
import { useBusinessContext } from 'contexts/BusinessProvider';
import CompanyInformationListItem from './CompanyInformationListItem';

const CompanyInformationList = () => {
  const { tempBusinessData } = useBusinessContext();

  return (
    <div className="p-4 bg-gray-50 rounded space-y-4">
      {tempBusinessData.length === 0 && (
        <div className="flex w-full justify-center">No hay información de la empresa</div>
      )}

      <div className="space-y-2">
        {tempBusinessData.map((infoItem, index) => (
          <CompanyInformationListItem
            key={uuidv4()}
            infoItem={infoItem}
            index={index}
            tempCompanyInformationLength={tempBusinessData.length}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyInformationList;
