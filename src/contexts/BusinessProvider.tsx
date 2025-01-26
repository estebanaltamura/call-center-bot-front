// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, IcompanyEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IOptionTextItem, IService } from 'types';

// ** Utils
import UTILS from 'utils';

interface BusinessContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  currentBussines: IcompanyEntity | null;
  setCurrentBussines: React.Dispatch<React.SetStateAction<IcompanyEntity | null>>;

  allBusinessesList: IcompanyEntity[];
  setAllBusinessesList: React.Dispatch<React.SetStateAction<IcompanyEntity[]>>;

  businessToEdit: IcompanyEntity | null;
  setBusinessToEdit: React.Dispatch<React.SetStateAction<IcompanyEntity | null>>;

  tempBusinessData: IOptionTextItem[];
  setTempBusinessData: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  tempCompanyServices: IService[];
  setTempCompanyServices: React.Dispatch<React.SetStateAction<IService[]>>;

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
  const [currentBussines, setCurrentBussines] = useState<IcompanyEntity | null>(null);
  const [allBusinessesList, setAllBusinessesList] = useState<IcompanyEntity[]>([]);
  const [businessToEdit, setBusinessToEdit] = useState<IcompanyEntity | null>(null);
  const [tempBusinessData, setTempBusinessData] = useState<IOptionTextItem[]>([]);
  const [tempCompanyServices, setTempCompanyServices] = useState<IService[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.companies, 'id', '==', docId);

      if (!res) return;

      setBusinessToEdit({
        ...res,
      });

      setTempCompanyServices(res.services);
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
      services: tempCompanyServices,
    };

    try {
      SERVICES.CMS.update(Entities.companies, businessToEdit.id, payload);

      setMode('main');
      setTempCompanyServices([]);
      setTempBusinessData([]);
      setBusinessToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      UTILS.POPUPS.simplePopUp('Ucurrio un error al guardar el documento');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempCompanyServices([]);
    setTempBusinessData([]);
    setBusinessToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del título del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allBusinessesList && settings?.currentBussinesName) {
      const currentBussinesData = allBusinessesList.filter(
        (item) => item.title === settings?.currentBussinesName,
      );

      setCurrentBussines(currentBussinesData[0]);
    }
  }, [settings?.currentBussinesName, allBusinessesList]);

  // Se cargan todos los systemPropmpts
  useEffect(() => {
    const colRef = collection(db, Entities.companies);
    const q = query(colRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IcompanyEntity[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data() as IcompanyEntity;
        data.push({
          ...docData,
        });
      });
      setAllBusinessesList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        mode,
        setMode,
        currentBussines,
        setCurrentBussines,
        allBusinessesList,
        setAllBusinessesList,
        businessToEdit,
        setBusinessToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempBusinessData,
        setTempBusinessData,
        tempCompanyServices,
        setTempCompanyServices,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default BusinessProvider;
