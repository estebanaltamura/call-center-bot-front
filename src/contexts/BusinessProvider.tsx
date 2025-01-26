// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, IBusinessEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IOptionTextItem, IService } from 'types';

// ** Utils
import UTILS from 'utils';

interface BusinessContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  currentBusiness: IBusinessEntity | null;
  setCurrentBusiness: React.Dispatch<React.SetStateAction<IBusinessEntity | null>>;

  allBusinessesList: IBusinessEntity[];
  setAllBusinessesList: React.Dispatch<React.SetStateAction<IBusinessEntity[]>>;

  businessToEdit: IBusinessEntity | null;
  setBusinessToEdit: React.Dispatch<React.SetStateAction<IBusinessEntity | null>>;

  tempBusinessData: IOptionTextItem[];
  setTempBusinessData: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  tempBusinessServices: IService[];
  setTempBusinessServices: React.Dispatch<React.SetStateAction<IService[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

const CompanyContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusinessContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useSystemContext debe usarse dentro de un SystemPromptProvider');
  }
  return context;
};

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useContext(SettingsContext);

  // States
  const [mode, setMode] = useState<'main' | 'edit'>('main');
  const [currentBusiness, setCurrentBusiness] = useState<IBusinessEntity | null>(null);
  const [allBusinessesList, setAllBusinessesList] = useState<IBusinessEntity[]>([]);
  const [businessToEdit, setBusinessToEdit] = useState<IBusinessEntity | null>(null);
  const [tempBusinessData, setTempBusinessData] = useState<IOptionTextItem[]>([]);
  const [tempBusinessServices, setTempBusinessServices] = useState<IService[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.business, 'id', '==', docId);

      if (!res) return;

      setBusinessToEdit({
        ...res,
      });

      setTempBusinessServices(res.services);
      setTempBusinessData(res.features);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      UTILS.POPUPS.simplePopUp('Error al cargar documento');
    }
  };

  const handleSave = async () => {
    if (!businessToEdit) return;

    const payload = {
      title: businessToEdit.title,
      features: tempBusinessData,
      services: tempBusinessServices,
    };

    try {
      SERVICES.CMS.update(Entities.business, businessToEdit.id, payload);

      setMode('main');
      setTempBusinessServices([]);
      setTempBusinessData([]);
      setBusinessToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      UTILS.POPUPS.simplePopUp('Ucurrio un error al guardar el documento');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempBusinessServices([]);
    setTempBusinessData([]);
    setBusinessToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del título del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allBusinessesList && settings?.currentBussinesName) {
      const currentBussinesData = allBusinessesList.filter(
        (item) => item.title === settings?.currentBussinesName,
      );

      setCurrentBusiness(currentBussinesData[0]);
    }
  }, [settings?.currentBussinesName, allBusinessesList]);

  // Se cargan todos los systemPropmpts
  useEffect(() => {
    const colRef = collection(db, Entities.business);
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IBusinessEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as IBusinessEntity;
        data.push({
          ...docData,
        });
      });
      setAllBusinessesList(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('tempBusinessData', tempBusinessData);
  }, [tempBusinessData]);

  return (
    <CompanyContext.Provider
      value={{
        mode,
        setMode,
        currentBusiness,
        setCurrentBusiness,
        allBusinessesList,
        setAllBusinessesList,
        businessToEdit,
        setBusinessToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempBusinessData,
        setTempBusinessData,
        tempBusinessServices,
        setTempBusinessServices,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default BusinessProvider;
