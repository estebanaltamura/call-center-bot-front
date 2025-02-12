// ServicesExpensesView.tsx
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from 'firebaseConfig';

// Importa los tipos y enums (ajusta la ruta según tu estructura)
import { Entities, EntityTypesMapReturnedValues } from 'types/dynamicSevicesTypes';
import { dynamicUpdate } from 'services/dynamicServices/dynamicUpdate';
import { dynamicCreate } from 'services/dynamicServices/dynamicCreate';
import { dynamicDelete } from 'services/dynamicServices/dynamicDelete';
import Loader from 'components/general/Loader';

// Íconos (se usa react-icons, asegúrate de tenerla instalada)
import { FaPencilAlt, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';

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
  // Estado para el valor del input (trabajamos con string para facilitar el manejo del input)
  const [inputValue, setInputValue] = useState(record ? record.data.toString() : '');

  // Cada vez que cambie el registro (por ejemplo, al cambiar la fecha) se reinicia el input y se cancela la edición
  useEffect(() => {
    setInputValue(record ? record.data.toString() : '');
    setIsEditing(false);
  }, [record]);

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
    // Si existe el registro y el valor no cambió, no se hace nada
    if (record && numericValue === record.data) {
      setIsEditing(false);
      setIsLoading(false);
      return;
    }
    if (record) {
      // Actualizar registro existente
      const updated = await dynamicUpdate(entity, record.id, { data: numericValue });
      onRecordChange(updated || record);
    } else {
      // Crear nuevo registro
      const newRecord = await dynamicCreate(entity, { data: numericValue });
      onRecordChange(newRecord || null);
    }
    setIsEditing(false);
    setIsLoading(false);
  };

  // Cancelar la edición: se restablece el valor original
  const handleCancel = () => {
    setInputValue(record ? record.data.toString() : '');
    setIsEditing(false);
  };

  // Activar modo edición
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Eliminar registro (se pide confirmación)
  const handleDelete = async () => {
    if (record && window.confirm('¿Está seguro de eliminar este registro?')) {
      setIsLoading(true);
      await dynamicDelete(entity, record.id);
      onRecordChange(null);
      setIsLoading(false);
    }
  };

  // Render según si existe registro y si se está en modo edición
  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '4px',
      }}
    >
      <h2>{entityLabels[entity]}</h2>
      {record ? (
        !isEditing ? (
          // Modo visualización: mostrar el valor y botones para editar y eliminar
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="text-right" style={{ fontSize: '1.25rem', margin: 0 }}>
              {record.data}
            </p>
            <div>
              <button onClick={handleEdit} title="Editar" style={{ marginRight: '0.5rem' }}>
                <FaPencilAlt />
              </button>
              <button onClick={handleDelete} title="Eliminar">
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ) : (
          // Modo edición: se muestra input y botones de confirmar y cancelar
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="no-arrows border rounded p-2 w-14 text-right"
            />
            <button onClick={handleConfirm} title="Confirmar" style={{ marginLeft: '0.5rem' }}>
              <FaCheck />
            </button>
            <button onClick={handleCancel} title="Cancelar" style={{ marginLeft: '0.5rem' }}>
              <FaTimes />
            </button>
          </div>
        )
      ) : (
        // No existe registro: se muestra input y botón para crear
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="no-arrows border rounded p-2 w-14 text-right"
          />
          <button onClick={handleConfirm} style={{ marginLeft: '0.5rem' }}>
            Crear
          </button>
        </div>
      )}
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
    // Calcula el inicio y fin del día
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const startTimestamp = Timestamp.fromDate(start);
    const endTimestamp = Timestamp.fromDate(end);

    const collRef = collection(db, entity);
    // Se consulta filtrando por la propiedad createdAt
    const q = query(
      collRef,
      where('createdAt', '>=', startTimestamp),
      where('createdAt', '<=', endTimestamp),
    );
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

  if (isLoading) return <Loader />;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Servicios de Gastos</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="datePicker">Selecciona una fecha: </label>
        <input
          id="datePicker"
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>
      {/* Organiza las 4 tarjetas en 2 columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
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
