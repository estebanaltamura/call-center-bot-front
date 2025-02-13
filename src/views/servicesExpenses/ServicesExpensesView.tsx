// ServicesExpensesView.tsx
import React, { useEffect, useRef, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from 'firebaseConfig';

// Importa los tipos y enums (ajusta la ruta según tu estructura)
import { Entities, EntityTypesMapReturnedValues } from 'types/dynamicSevicesTypes';
import { dynamicUpdate } from 'services/dynamicServices/dynamicUpdate';
import { dynamicCreate } from 'services/dynamicServices/dynamicCreate';
import Loader from 'components/general/Loader';

// Íconos (se usa react-icons, asegúrate de tenerla instalada)
import { FaPencilAlt, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { SERVICES } from 'services/index';
import UTILS from 'utils';

// -----------------------------------------------------------------------------
// 1. Definición de las “entidades de cost”
export type CostEntity =
  | Entities.stats_whatsappApiCost
  | Entities.stats_iaCost
  | Entities.stats_facebookAdsCost
  | Entities.stats_googleAdsCost;

const costEntities: CostEntity[] = [
  Entities.stats_whatsappApiCost,
  Entities.stats_iaCost,
  Entities.stats_facebookAdsCost,
  Entities.stats_googleAdsCost,
];

// Etiquetas que se mostrarán en la UI para cada entidad
const entityLabels: Record<CostEntity, string> = {
  [Entities.stats_whatsappApiCost]: 'Costo WhatsApp API',
  [Entities.stats_iaCost]: 'Costo IA',
  [Entities.stats_facebookAdsCost]: 'Costo Facebook Ads',
  [Entities.stats_googleAdsCost]: 'Costo Google Ads',
};

// Constante con las imágenes (reemplaza las URL por las imágenes que correspondan)
const entityImages: Record<CostEntity, string> = {
  [Entities.stats_whatsappApiCost]: '/logos/whatsapp.svg.webp',
  [Entities.stats_iaCost]: '/logos/iaLogo.png',
  [Entities.stats_facebookAdsCost]: '/logos/facebookLogo.jpg',
  [Entities.stats_googleAdsCost]: '/logos/googleLogo.png',
};

// -----------------------------------------------------------------------------
// 2. Componente para cada “tarjeta” de registro de costo
interface CostRecordCardProps {
  entity: CostEntity;
  record: EntityTypesMapReturnedValues[CostEntity] | null;
  selectedDate: Date;
  onRecordChange: (record: EntityTypesMapReturnedValues[CostEntity] | null) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CostRecordCard: React.FC<CostRecordCardProps> = ({
  entity,
  record,
  selectedDate,
  onRecordChange,
  setIsLoading,
}) => {
  // Estado para controlar si se está editando o creando
  const [isEditing, setIsEditing] = useState(false);
  // Estado para el valor del input (se usa string para facilitar el manejo)
  const [inputValue, setInputValue] = useState(record?.value?.toString() ?? '');

  // Al cambiar el registro (por ejemplo, al cambiar de fecha) se reinicia el input y se cancela la edición
  useEffect(() => {
    setInputValue(record?.value?.toString() ?? '');
    setIsEditing(false);
  }, [record]);

  // Función para obtener una fecha clonada con horas reiniciadas
  const getNormalizedDate = (date: Date) => {
    const normalized = new Date(date.getTime());
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Función para confirmar (crear o actualizar)
  const handleConfirm = async () => {
    setIsLoading(true);
    if (!inputValue) {
      setIsLoading(false);
      return;
    }
    const numericValue = Number(inputValue);
    if (isNaN(numericValue)) {
      setIsLoading(false);
      return;
    }
    if (numericValue < 0) {
      alert('El valor no puede ser negativo');
      setIsLoading(false);
      return;
    }
    // Si ya existe el registro y el valor no ha cambiado, no se hace nada
    if (record && numericValue === record.value) {
      setIsEditing(false);
      setIsLoading(false);
      return;
    }
    // Se prepara el payload, incluyendo el valor y la fecha normalizada convertida a Timestamp
    const payload = {
      value: numericValue,
      date: Timestamp.fromDate(getNormalizedDate(selectedDate)),
    };
    if (record) {
      // Actualizar registro existente
      const updated = await dynamicUpdate(entity, record.id, payload);
      onRecordChange(updated || record);
    } else {
      // Crear nuevo registro
      const newRecord = await dynamicCreate(entity, payload);
      onRecordChange(newRecord || null);
    }
    setIsEditing(false);
    setIsLoading(false);
  };

  // Función para cancelar la edición: se restablece el valor original
  const handleCancel = () => {
    setInputValue(record ? record.value.toString() : '');
    setIsEditing(false);
  };

  // Activar modo edición
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Función para eliminar el registro (con confirmación)
  const handleDelete = async () => {
    if (record) {
      UTILS.POPUPS.twoOptionsPopUp('¿Está seguro de eliminar este registro?', async () => {
        setIsLoading(true);
        await SERVICES.CMS.delete(entity, record.id);
        onRecordChange(null);
        setIsLoading(false);
      });
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {/* 30% izquierdo para la imagen */}
      <div
        style={{
          width: '30%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRight: '1px solid #eee',
          paddingRight: '0.5rem',
        }}
      >
        <img
          src={entityImages[entity]}
          alt={entityLabels[entity]}
          style={{ maxWidth: '100px', height: 'auto' }}
        />
      </div>
      {/* 70% derecho para el contenido */}
      <div
        style={{
          width: '70%',
          paddingLeft: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <h2 className="text-lg font-semibold text-center">{entityLabels[entity]}</h2>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="no-arrows border rounded p-2 w-80 text-center"
            disabled={!isEditing && record ? true : false}
          />
        </div>
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
          {record ? (
            !isEditing ? (
              // Modo visualización: botones para editar y eliminar
              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  title="Editar"
                  className="bg-blue-600 text-white px-7 py-3 rounded"
                >
                  <FaPencilAlt className="text-white" />
                </button>
                <button
                  onClick={handleDelete}
                  title="Eliminar"
                  className="bg-red-600 text-white px-7 py-3 rounded"
                >
                  <FaTrashAlt className="text-white" />
                </button>
              </div>
            ) : (
              // Modo edición: botones para confirmar y cancelar
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  title="Cancelar"
                  className="bg-red-600 text-white px-7 py-3 rounded"
                >
                  <FaTimes className="text-white" />
                </button>
                <button
                  onClick={handleConfirm}
                  title="Confirmar"
                  className="bg-green-600 text-white px-7 py-3 rounded"
                >
                  <FaCheck className="text-white" />
                </button>
              </div>
            )
          ) : (
            // No existe registro: botón para crear
            <button onClick={handleConfirm} className="bg-green-600 text-white px-7 py-2 rounded">
              Crear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 3. Componente principal: ServicesExpensesView
const ServicesExpensesView: React.FC = () => {
  // Estado para la fecha seleccionada (por defecto la fecha actual)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Estado para los registros de cada entidad de costo
  const [costRecords, setCostRecords] = useState<
    Record<CostEntity, EntityTypesMapReturnedValues[CostEntity] | null>
  >({
    [Entities.stats_whatsappApiCost]: null,
    [Entities.stats_iaCost]: null,
    [Entities.stats_facebookAdsCost]: null,
    [Entities.stats_googleAdsCost]: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Función para consultar el registro de una entidad para la fecha seleccionada
  const fetchCostRecord = async (entity: CostEntity, date: Date) => {
    // Calcula el inicio y fin del día sin modificar selectedDate
    const start = new Date(date.getTime());
    start.setHours(0, 0, 0, 0);
    const end = new Date(date.getTime());
    end.setHours(23, 59, 59, 999);

    const startTimestamp = Timestamp.fromDate(start);
    const endTimestamp = Timestamp.fromDate(end);

    const collRef = collection(db, entity);
    // Se consulta filtrando por la propiedad 'date' (nueva propiedad)
    const q = query(collRef, where('date', '>=', startTimestamp), where('date', '<=', endTimestamp));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    } else {
      // Se asume que solo hay un registro por día para la entidad
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as EntityTypesMapReturnedValues[CostEntity];
    }
  };

  // Cada vez que se cambia la fecha se consulta Firestore para cada entidad de costo
  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      const newRecords: Partial<Record<CostEntity, EntityTypesMapReturnedValues[CostEntity] | null>> = {};
      for (const entity of costEntities) {
        const rec = await fetchCostRecord(entity, selectedDate);
        newRecords[entity] = rec;
      }
      setCostRecords(newRecords as Record<CostEntity, EntityTypesMapReturnedValues[CostEntity] | null>);
      setIsLoading(false);
    };

    fetchAll();
  }, [selectedDate]);

  // --- Componente DatePicker ---
  interface DatePickerProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
  }

  const DatePickerContainer: React.FC<DatePickerProps> = ({ selectedDate, setSelectedDate }) => {
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
      // Si el método showPicker está disponible, lo usamos para forzar el despliegue del almanaque
      if (dateInputRef.current) {
        if (typeof dateInputRef.current.showPicker === 'function') {
          dateInputRef.current.showPicker();
        } else {
          // Fallback: usamos click() para forzar el desplegado
          dateInputRef.current.click();
        }
      }
    };

    return (
      <div
        onClick={handleContainerClick}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          cursor: 'pointer',
        }}
      >
        <label htmlFor="datePicker" style={{ marginRight: '2px', fontSize: '20px', cursor: 'pointer' }}>
          Fecha:
        </label>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            ref={dateInputRef}
            id="datePicker"
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            style={{ marginRight: '0.5rem', fontSize: '19px', cursor: 'pointer' }}
            // Asegúrate de NO aplicar estilos que oculten el picker nativo
            className="custom-date-input"
          />
          <span
            role="img"
            aria-label="calendar"
            style={{
              marginLeft: '-38px',
              fontSize: '20px',
              position: 'relative',
              top: '1px',
              cursor: 'pointer',
            }}
          >
            📅
          </span>
        </div>
      </div>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">COSTOS DE SERVICIOS</h1>
      {/* Date picker con ícono personalizado */}
      <DatePickerContainer selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {/* Organiza las 4 tarjetas en 2 columnas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginTop: '40px',
        }}
      >
        {costEntities.map((entity) => (
          <CostRecordCard
            key={entity}
            setIsLoading={setIsLoading}
            entity={entity}
            record={costRecords[entity]}
            selectedDate={selectedDate}
            onRecordChange={(record) =>
              setCostRecords((prev) => ({
                ...prev,
                [entity]: record,
              }))
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesExpensesView;
