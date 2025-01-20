import { FieldType, Goal } from 'contexts/GoalsProvider';
import { Field } from 'contexts/GoalsProvider';
import { GoalsContext } from 'contexts/GoalsProvider';
import React, { useContext, useState } from 'react';

const GoalsTab: React.FC = () => {
  const { goals, setGoals } = useContext(GoalsContext);
  const [mode, setMode] = useState<'list' | 'create'>('list');

  // -- Estados para crear un nuevo Goal --
  const [newGoalPrompt, setNewGoalPrompt] = useState('');
  const [newGoalFields, setNewGoalFields] = useState<Field[]>([]);

  // Estados para el mini-form del Field nuevo
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('string');

  // -------------------- MODO LIST --------------------

  // Reordenar Goals arriba
  const moveGoalUp = (index: number) => {
    if (index === 0) return;
    const updated = [...goals];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setGoals(updated);
  };

  // Reordenar Goals abajo
  const moveGoalDown = (index: number) => {
    if (index === goals.length - 1) return;
    const updated = [...goals];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setGoals(updated);
  };

  // Borrar un Goal
  const handleDeleteGoal = (index: number) => {
    const updated = [...goals];
    updated.splice(index, 1);
    setGoals(updated);
  };

  // Ir a modo crear
  const handleGoToCreate = () => {
    // Limpiamos datos previos de creación
    setNewGoalPrompt('');
    setNewGoalFields([]);
    setFieldName('');
    setFieldType('string');
    setMode('create');
  };

  // -------------------- MODO CREATE --------------------

  // Agregar un field al Goal en creación
  const handleAddField = () => {
    // Validar que haya name
    if (!fieldName.trim()) {
      alert('El nombre del Field no puede estar vacío.');
      return;
    }
    // Agregar
    const newField: Field = { name: fieldName, type: fieldType };
    setNewGoalFields((prev) => [...prev, newField]);
    // Limpiar el mini-form de field
    setFieldName('');
    setFieldType('string');
  };

  // Crear el Goal definitivo
  const handleCreateGoal = () => {
    // Validar prompt no vacío y al menos 1 field
    if (!newGoalPrompt.trim()) return;
    if (newGoalFields.length === 0) return;

    const newGoal: Goal = {
      prompt: newGoalPrompt,
      fields: newGoalFields,
    };
    setGoals((prev) => [...prev, newGoal]);

    // Volver a modo list
    setMode('list');
  };

  // Botón deshabilitado solo si no cumple requisitos
  const isCreateGoalDisabled = !newGoalPrompt.trim() || newGoalFields.length === 0;

  // -------------------- RENDER --------------------

  if (mode === 'list') {
    // LISTADO DE GOALS
    return (
      <div className="p-4 w-full mx-auto space-y-6">
        <h1 className="text-xl font-bold">Goals</h1>

        <button onClick={handleGoToCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
          Agregar Goal
        </button>

        {goals.length === 0 && <p className="text-gray-600 mt-4">No hay goals creados aún.</p>}

        {goals.map((goal, index) => (
          <div key={index} className="border p-3 rounded bg-gray-50 flex flex-col mt-3">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">{`Goal ${index + 1}`}</div>
              <div className="space-x-2">
                {index !== 0 && (
                  <button onClick={() => moveGoalUp(index)} className="bg-gray-300 px-2 py-1 rounded">
                    ↑
                  </button>
                )}

                {index !== goals.length - 1 && (
                  <button onClick={() => moveGoalDown(index)} className="bg-gray-300 px-2 py-1 rounded">
                    ↓
                  </button>
                )}

                <button
                  onClick={() => handleDeleteGoal(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Borrar
                </button>
              </div>
            </div>

            <div className="mb-2">
              <span className="font-bold mr-2">Prompt:</span>
              <span>{goal.prompt}</span>
            </div>

            <div>
              <span className="font-bold">Fields:</span>
              {goal.fields.length === 0 && <p className="text-gray-400 ml-2">Sin fields</p>}
              {goal.fields.map((f, i) => (
                <div key={i} className="ml-4 text-sm">
                  • <strong>{f.name}</strong> <em>({f.type})</em>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // CREACIÓN DE UN NUEVO GOAL
  return (
    <div className="p-4 w-full mx-auto space-y-6">
      <h1 className="text-xl font-bold">Crear nuevo Goal</h1>

      {/* Prompt del Goal */}
      <div className="space-y-1">
        <label className="block font-semibold">Prompt:</label>
        <textarea
          style={{
            height: '100px',
            textAlign: 'left',
            verticalAlign: 'top',
            paddingTop: '8px',
          }}
          className="border px-2 py-1 rounded w-full"
          value={newGoalPrompt}
          onChange={(e) => setNewGoalPrompt(e.target.value)}
        />
      </div>

      {/* Lista de fields agregados */}
      <div className="space-y-2">
        <div className="font-semibold">Fields:</div>

        {newGoalFields.length === 0 && <p className="text-sm text-gray-500 ml-2">Aún no hay fields.</p>}
        {newGoalFields.map((f, i) => (
          <div key={i} className="ml-4 text-sm">
            • <strong>{f.name}</strong> <em>({f.type})</em>
          </div>
        ))}
      </div>

      {/* Mini-form para agregar field */}
      <div className="border p-3 bg-gray-50 rounded space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="border px-2 py-1 rounded flex-1"
            placeholder="Nombre del field"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
          <select
            className="border px-2 py-1 rounded"
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value as FieldType)}
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
            <option value="date">date</option>
          </select>
        </div>
        <button onClick={handleAddField} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
          Agregar Field
        </button>
      </div>

      {/* Botón de "Crear Goal" */}
      <div className="flex space-x-2">
        <button
          onClick={handleCreateGoal}
          className={`px-4 py-2 rounded text-white ${
            isCreateGoalDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'
          }`}
          disabled={isCreateGoalDisabled}
        >
          Crear Goal
        </button>
        <button onClick={() => setMode('list')} className="bg-gray-300 px-4 py-2 rounded">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default GoalsTab;
