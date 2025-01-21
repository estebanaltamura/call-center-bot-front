// ** 3rd party library
import { v4 as uuidv4 } from 'uuid';

// ** Components
import Typo from 'components/general/Typo';
import { useRulesContext } from 'contexts/RulesProvider';
import RulesInformationList from '../rulesInformationList/RulesInformationList';

const OrderedList = () => {
  const { tempRulesInformation } = useRulesContext();

  return (
    <div className="border border-gray-400 p-4 bg-gray-50 rounded space-y-4">
      <h2 className="font-semibold text-center">Ordenamiento</h2>

      <div className="space-y-2">
        <>
          {tempRulesInformation && tempRulesInformation.length > 0 && (
            <div key={uuidv4()} className="flex flex-col border border-black rounded-b">
              <div className="relative bg-blue-600  flex h-[73px] justify-center items-center rounded-t">
                <Typo type="title2Semibold" style={{ color: 'white' }}>
                  IMPORMACION DE LAS REGLAS
                </Typo>
              </div>
              <RulesInformationList />
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default OrderedList;
