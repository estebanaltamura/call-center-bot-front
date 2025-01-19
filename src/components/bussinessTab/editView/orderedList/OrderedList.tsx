import { OrderedListType } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useCompanyContext } from 'contexts/CompanyProvider';
import Typo from 'components/general/Typo';
import { useEditViewContext } from '../EditViewContainer';
import ServicesList from '../servicesList/ServicesList';
import CompanyInformationList from '../companyInformationList/CompanyInformationList';

const OrderedList = () => {
  const {
    moveUpCompanyInformationItem,
    moveDownCompanyInformationItem,
    deleteCompanyInformationItem,
    tempCompanyInformation,
    tempCompanyServices,
  } = useCompanyContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // Verificar si el contenido del textarea sobrepasa la altura visible
  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setIsOverflowing(element.scrollHeight > element.offsetHeight);
    }
  }, [prompt]);

  // Siempre scrollear hacia arriba al contraer
  useEffect(() => {
    if (!isExpanded && textRef.current) {
      textRef.current.scrollTo(0, 0);
    }
  }, [isExpanded]);

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
            <div key={uuidv4()} className="flex flex-col border border-black rounded-b">
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
