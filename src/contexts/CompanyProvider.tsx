// ** React
import React, { createContext, useContext, useEffect, useState } from 'react';

// ** Contexts
import { SettingsContext } from 'contexts/SettingsProvider';

// ** Firebase / Firestore
import { db } from 'firebaseConfig'; // Ajusta la ruta según tu configuración
import { collection, onSnapshot, query } from 'firebase/firestore';

// ** Services
import { SERVICES } from 'services/index';
import { Entities, IcompanyEntity, ISystemPromptEntity } from 'types/dynamicSevicesTypes';

// ** Types
import { IOptionTextItem, IService } from 'types';

interface SystemContextType {
  currentBussines: IcompanyEntity | null;
  setCurrentBussines: React.Dispatch<React.SetStateAction<IcompanyEntity | null>>;

  allBussinesesList: IcompanyEntity[];
  setAllBussinesesList: React.Dispatch<React.SetStateAction<IcompanyEntity[]>>;

  mode: 'main' | 'edit';
  setMode: React.Dispatch<React.SetStateAction<'main' | 'edit'>>;

  companyToEdit: IcompanyEntity | null;
  setCompanyToEdit: React.Dispatch<React.SetStateAction<IcompanyEntity | null>>;

  tempCompanyInformation: IOptionTextItem[];
  setTempCompanyInformation: React.Dispatch<React.SetStateAction<IOptionTextItem[]>>;

  tempCompanyServices: IService[];
  setTempCompanyServices: React.Dispatch<React.SetStateAction<IService[]>>;

  handleModifyDoc: (docId: string) => Promise<void>;
  addCompanyInformationItem: (option: string, text: string) => void;
  moveUpCompanyInformationItem: (index: number) => void;
  moveDownCompanyInformationItem: (index: number) => void;
  handleSave: () => Promise<void>;
  handleCancel: () => void;

  addCompanyService: (service: IService) => void;
  moveUpCompanyServices: (index: number) => void;
  moveDownCompanyServices: (index: number) => void;
  deleteCompanyInformationItem: (index: number) => void;
  deleteService: (index: number) => void;
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
  const [currentBussines, setCurrentBussines] = useState<IcompanyEntity | null>(null);
  const [allBussinesesList, setAllBussinesesList] = useState<IcompanyEntity[]>([]);
  const [mode, setMode] = useState<'main' | 'edit'>('main');

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

  const addCompanyInformationItem = (option: string, text: string) => {
    const newItem = { option, text };
    setTempCompanyInformation([...tempCompanyInformation, newItem]);
  };

  const deleteCompanyInformationItem = (index: number) => {
    const updated = [...tempCompanyInformation];
    updated.splice(index, 1);
    setTempCompanyInformation(updated);
  };

  const deleteService = (index: number) => {
    const updated = [...tempCompanyServices];
    updated.splice(index, 1);
    setTempCompanyServices(updated);
  };

  const moveUpCompanyInformationItem = (index: number) => {
    console.log(index);
    if (index === 0) return;
    const updated = [...tempCompanyInformation];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempCompanyInformation(updated);
  };

  const moveDownCompanyInformationItem = (index: number) => {
    if (index === tempCompanyInformation.length - 1) return;
    const updated = [...tempCompanyInformation];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempCompanyInformation(updated);
  };

  const addCompanyService = (service: IService) => {
    setTempCompanyServices((prev) => [...prev, service]);
  };

  /**
   * Mueve hacia arriba el servicio en el array tempServices.
   */
  const moveUpCompanyServices = (index: number) => {
    if (index === 0) return;
    const updated = [...tempCompanyServices];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setTempCompanyServices(updated);
  };

  /**
   * Mueve hacia abajo el servicio en el array tempServices.
   */
  const moveDownCompanyServices = (index: number) => {
    if (index === tempCompanyServices.length - 1) return;
    const updated = [...tempCompanyServices];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setTempCompanyServices(updated);
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
      setCompanyToEdit(null);
    } catch (error) {
      console.error('Error al guardar documento:', error);
      alert('Ocurrió un error al guardar.');
    }
  };

  const handleCancel = () => {
    setMode('main');
    setCompanyToEdit(null);
  };

  // Cuando cargo todos los system prompts y cargo el string del titulo del system prompt en uso, se setea el estado que contiene todos los datos del prompt en uso
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

  useEffect(() => {
    console.log('COMPANY INFORMATION', tempCompanyInformation, 'SERVICES', tempCompanyServices);
  }, [tempCompanyInformation, tempCompanyServices]);

  return (
    <CompanyContext.Provider
      value={{
        currentBussines,
        setCurrentBussines,
        allBussinesesList,
        setAllBussinesesList,
        mode,
        setMode,
        companyToEdit,
        setCompanyToEdit,

        tempCompanyInformation,
        setTempCompanyInformation,

        handleModifyDoc,
        addCompanyInformationItem,
        moveUpCompanyInformationItem,
        moveDownCompanyInformationItem,
        handleSave,
        handleCancel,
        deleteCompanyInformationItem,
        tempCompanyServices,
        setTempCompanyServices,
        addCompanyService,
        moveUpCompanyServices,
        moveDownCompanyServices,
        deleteService,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
