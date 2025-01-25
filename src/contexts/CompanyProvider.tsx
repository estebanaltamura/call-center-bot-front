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

interface SystemContextType {
  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  currentBussines: IcompanyEntity | null;
  setCurrentBussines: React.Dispatch<React.SetStateAction<IcompanyEntity | null>>;

  allBussinesesList: IcompanyEntity[];
  setAllBussinesesList: React.Dispatch<React.SetStateAction<IcompanyEntity[]>>;

  companyToEdit: IcompanyEntity | null;
  setCompanyToEdit: React.Dispatch<React.SetStateAction<IcompanyEntity | null>>;

  tempCompanyInformation: IOptionTextItem[];
  setTempCompanyInformation: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  tempCompanyServices: IService[];
  setTempCompanyServices: React.Dispatch<React.SetStateAction<IService[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  handleSave: () => Promise<void>;
  handleCancel: () => void;
}

const CompanyContext = createContext<SystemContextType | undefined>(undefined);

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useSystemContext debe usarse dentro de un SystemPromptProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const settings = useContext(SettingsContext);

  // States
  const [mode, setMode] = useState<'main' | 'edit'>('main');
  const [currentBussines, setCurrentBussines] = useState<IcompanyEntity | null>(null);
  const [allBussinesesList, setAllBussinesesList] = useState<IcompanyEntity[]>([]);
  const [companyToEdit, setCompanyToEdit] = useState<IcompanyEntity | null>(null);
  const [tempCompanyInformation, setTempCompanyInformation] = useState<IOptionTextItem[]>([]);
  const [tempCompanyServices, setTempCompanyServices] = useState<IService[]>([]);

  const handleModifyDoc = async (docId: string) => {
    try {
      const res = await SERVICES.CMS.get(Entities.companies, 'id', '==', docId);

      if (!res) return;

      setCompanyToEdit({
        ...res,
      });

      // Setea los bullets del systemPrompt puntual que se quiere modificar
      // Setea el modo de la tab systemPrompt en edit. Oculta el componente con el listado de systemPrompts y muestra el componente para editar un systemPrompt puntual
      setTempCompanyServices(res.services);
      setTempCompanyInformation(res.features);
      setMode('edit');
    } catch (error) {
      console.error('Error al cargar documento:', error);
      alert('Error al cargar documento');
    }
  };

  const handleSave = async () => {
    if (!companyToEdit) return;

    const payload = {
      title: companyToEdit.title,
      features: tempCompanyInformation,
      services: tempCompanyServices,
    };

    try {
      SERVICES.CMS.update(Entities.companies, companyToEdit.id, payload);

      alert('Documento guardado correctamente');
      setMode('main');
      setTempCompanyServices([]);
      setTempCompanyInformation([]);
      setCompanyToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setTempCompanyServices([]);
    setTempCompanyInformation([]);
    setCompanyToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del título del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
  useEffect(() => {
    if (allBussinesesList && settings?.currentBussinesName) {
      const currentBussinesData = allBussinesesList.filter(
        (item) => item.title === settings?.currentBussinesName,
      );

      setCurrentBussines(currentBussinesData[0]);
    }
  }, [settings?.currentBussinesName, allBussinesesList]);

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
      setAllBussinesesList(data);
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
        allBussinesesList,
        setAllBussinesesList,
        companyToEdit,
        setCompanyToEdit,
        handleModifyDoc,
        handleSave,
        handleCancel,
        tempCompanyInformation,
        setTempCompanyInformation,
        tempCompanyServices,
        setTempCompanyServices,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
