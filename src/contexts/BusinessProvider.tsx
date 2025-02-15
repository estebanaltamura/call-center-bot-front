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
import { IFilter } from 'services/dynamicServices/dynamicGet';

interface BusinessContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  allItemList: IBusinessEntity[];
  setAllItemList: React.Dispatch<React.SetStateAction<IBusinessEntity[]>>;

  itemToEdit: IBusinessEntity | null;
  setItemToEdit: React.Dispatch<React.SetStateAction<IBusinessEntity | null>>;

  tempBullets: IOptionTextItem[];
  setTempBullets: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

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
  const [allItemList, setAllItemList] = useState<IBusinessEntity[]>([]);
  const [itemToEdit, setItemToEdit] = useState<IBusinessEntity | null>(null);
  const [tempBullets, setTempBullets] = useState<IOptionTextItem[]>([]);
  const [tempBusinessServices, setTempBusinessServices] = useState<IService[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const filters: IFilter[] = [{ field: 'id', operator: '==', value: docId }];

      const res = await SERVICES.CMS.get(Entities.business, filters);

      if (!res) return;

      const item = res[0];

      setItemToEdit({
        ...item,
      });

      setTempBusinessServices(item.services);
      setTempBullets(item.features);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      UTILS.POPUPS.simplePopUp('Error al cargar documento');
    }
  };

  const handleSave = async () => {
    if (!itemToEdit) return;

    const payload = {
      title: itemToEdit.title,
      features: tempBullets,
      services: tempBusinessServices,
    };

    try {
      SERVICES.CMS.update(Entities.business, itemToEdit.id, payload);

      setMode('main');
      setTempBusinessServices([]);
      setTempBullets([]);
      setItemToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      UTILS.POPUPS.simplePopUp('Ucurrio un error al guardar el documento');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempBusinessServices([]);
    setTempBullets([]);
    setItemToEdit(null);
  };

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
      setAllItemList(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        mode,
        setMode,
        allItemList,
        setAllItemList,
        itemToEdit,
        setItemToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempBullets,
        setTempBullets,
        tempBusinessServices,
        setTempBusinessServices,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default BusinessProvider;
