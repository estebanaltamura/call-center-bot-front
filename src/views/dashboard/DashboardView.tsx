// ** React
import React, { useEffect, useState } from 'react';
// ** Components
import Loader from 'components/general/Loader';
import CombinedStatsChart from 'components/charts/CombinatedStatsChart';
import StatsChart from 'components/charts/StatsChart';
// ** Services
import { SERVICES } from 'services/index';
// ** Types
import { Entities } from 'types/dynamicSevicesTypes';
import { dynamicCreate } from 'services/dynamicServices/dynamicCreate';
// ** Config
import { initialDate, statEntityMapNames, implementedSince } from 'statsConfig';
import UTILS from 'utils';

// Función para formatear el label (fallback)
const formatLabel = (label: string): string => {
  const withoutPrefix = label.replace(/^stats_/, '');
  const withSpaces = withoutPrefix.replace(/([A-Z])/g, ' $1').trim();
  return withSpaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Función para obtener el label final usando el config
const getDisplayName = (entity: string): string =>
  statEntityMapNames[entity as Entities] ?? formatLabel(entity);

// Componente de multiselect con dropdown y checkboxes
type MultiSelectDropdownProps = {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
};

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedOptions, onChange }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleOptionChange = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((o) => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="relative w-[900px]">
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full border p-2 rounded text-left flex items-center bg-white"
      >
        {/* Contenedor flexible que se trunca */}
        <span className="flex-1 min-w-0 truncate overflow-hidden">
          {selectedOptions.length > 0
            ? selectedOptions.map((opt) => getDisplayName(opt)).join(', ')
            : 'Seleccionar stats'}
        </span>
        <svg
          className="w-4 h-4 ml-2 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute mt-1 w-full rounded-md shadow-lg bg-white z-10 max-h-60 overflow-auto scroll-custom">
          <div className="py-1">
            {options.map((option) => (
              <label key={option} className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                  className="mr-2"
                />
                {getDisplayName(option)}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardView = () => {
  const [stats, setStats] = useState<{ label: string; data: { date: Date; value: number }[] }[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Esta semana');
  const [isLoading, setIsLoading] = useState(true);

  // Controla qué estadísticas se muestran (según el multiselect/carga de escena)
  const [sceneSelectedStats, setSceneSelectedStats] = useState<string[]>([]);
  // Controla cuáles cards se han clickeado para comparar (para el gráfico combinado)
  const [selectedStats, setSelectedStats] = useState<string[]>([]);

  // Estados para el pop-up de cargar escena
  const [showLoadSceneModal, setShowLoadSceneModal] = useState(false);
  const [showSaveSceneModal, setShowSaveSceneModal] = useState(false);
  const [newSceneName, setNewSceneName] = useState('');

  const [availableScenes, setAvailableScenes] = useState<any[]>([]);
  const [selectedScene, setSelectedScene] = useState<string>('');

  const filters = ['Últimos 7 días', 'Últimos 30 días', 'Últimos 90 días'];

  // Funciones de fechas y rangos
  const getDaysFromFilter = (filter: string): 7 | 30 | 90 => {
    if (filter === 'Últimos 30 días') return 30;
    if (filter === 'Últimos 90 días') return 90;
    return 7;
  };

  const getRange = (days: number): [Date, Date] => {
    const now = new Date();
    const start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    return [start, now];
  };

  const differenceInCalendarDays = (d: Date, start: Date): number => {
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const dDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffTime = dDay.getTime() - startDay.getTime();
    return Math.floor(diffTime / (24 * 60 * 60 * 1000));
  };

  const groupDataByDay = (items: { date: Date; value: number }[], start: Date, end: Date) => {
    const dayCount = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const dailyValues = Array(dayCount).fill(0);
    items.forEach((item) => {
      const itemDate = new Date(item.date);
      // Ignorar cualquier valor cuya fecha sea anterior a initialDate
      if (itemDate < initialDate) return;
      const diff = differenceInCalendarDays(itemDate, start);
      if (diff >= 0 && diff < dayCount) dailyValues[diff] += item.value;
    });
    return dailyValues;
  };

  const createLabels = (start: Date, end: Date, days: number): string[] => {
    const labels: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      labels.push(`${day}/${month}`);
    }
    return labels;
  };

  // Obtención de datos para cada entidad estadística
  const fetchStats = async () => {
    setIsLoading(true);
    const days = getDaysFromFilter(selectedFilter);
    const [startDate, endDate] = getRange(days);

    const promises = Object.keys(Entities)
      .filter((key) => key.startsWith('stats_'))
      .map(async (entity) => {
        const res = await SERVICES.CMS.get(Entities[entity as keyof typeof Entities], [
          { field: 'date', operator: '>=', value: startDate },
          { field: 'date', operator: '<=', value: endDate },
        ]);
        return { entity, data: res };
      });

    const results = await Promise.all(promises);

    setStats(
      results
        .map(({ entity, data }) =>
          data
            ? {
                label: entity,
                data: data.map((item: any) => ({
                  date: item.date.toDate ? item.date.toDate() : new Date(item.date),
                  value: item?.value ?? 0,
                })),
              }
            : null,
        )
        .filter(Boolean) as { label: string; data: { date: Date; value: number }[] }[],
    );

    setIsLoading(false);
  };

  // Funciones para cargar/guardar escenas (sin cambios sustanciales)
  const openLoadSceneModal = async () => {
    try {
      const scenes = await SERVICES.CMS.get(Entities.scenes_Stats);
      if (scenes && scenes.length > 0) {
        setAvailableScenes(scenes);
        setSelectedScene(scenes[0].name);
        setShowLoadSceneModal(true);
      } else {
        alert('No hay escenas guardadas');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveScene = async () => {
    if (newSceneName.trim() === '') {
      alert('Por favor, ingrese un nombre para la escena');
      return;
    }
    const payload = {
      name: newSceneName,
      selectedStats: sceneSelectedStats,
    };
    const created = await dynamicCreate(Entities.scenes_Stats, payload);
    if (created) {
      UTILS.POPUPS.simplePopUp('Escena guardada correctamente');
      setShowSaveSceneModal(false);
      setNewSceneName('');
    } else {
      alert('Error al guardar la escena');
    }
  };

  const loadSelectedScene = () => {
    const scene = availableScenes.find((s: any) => s.name === selectedScene);
    if (scene) {
      setSceneSelectedStats(scene.selectedStats);
      // Reiniciamos la selección para comparación
      setSelectedStats([]);
      setShowLoadSceneModal(false);
    } else {
      alert('Escena no encontrada');
    }
  };

  const closeLoadSceneModal = () => {
    setShowLoadSceneModal(false);
  };

  useEffect(() => {
    fetchStats();
  }, [selectedFilter]);

  const days = getDaysFromFilter(selectedFilter);
  const [rangeStart, rangeEnd] = getRange(days);
  const labels = createLabels(rangeStart, rangeEnd, days);

  // Se muestran únicamente las estadísticas definidas en el multiselect
  const statsToDisplay = stats.filter((stat) => sceneSelectedStats.includes(stat.label));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">DASHBOARD</h1>
      <div
        className="overflow-auto scroll-custom pr-4"
        style={{ minHeight: '800px', maxHeight: 'calc(100vh - 287px)' }}
      >
        <div className="px-4 py-2 bg-gray-50 rounded shadow">
          <select
            className="border p-2 rounded w-full my-4"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </select>

          {/* Multiselect para elegir qué cards (stats) se mostrarán */}
          <div className="flex items-center space-x-2 mb-4 w-full">
            <div className="flex-1 min-w-0">
              <MultiSelectDropdown
                options={stats.map((stat) => stat.label)}
                selectedOptions={sceneSelectedStats}
                onChange={(newSelection) => {
                  setSceneSelectedStats(newSelection);
                  setSelectedStats([]);
                }}
              />
            </div>
            <button className="border p-2 rounded w-48 bg-green-500 text-white" onClick={openLoadSceneModal}>
              Cargar escena
            </button>
            <button
              className="border p-2 rounded w-48 bg-blue-500 text-white"
              onClick={() => setShowSaveSceneModal(true)}
            >
              Guardar escena
            </button>
          </div>

          {showSaveSceneModal && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded shadow-lg w-80 relative">
                {/* Botón para cerrar el modal */}
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowSaveSceneModal(false)}
                >
                  &#x2715;
                </button>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-4">Guardar Escena</h2>
                  <input
                    type="text"
                    value={newSceneName}
                    onChange={(e) => setNewSceneName(e.target.value)}
                    placeholder="Nombre de la escena"
                    className="border p-2 rounded w-full mb-4"
                  />
                  <button className="w-full border p-2 rounded bg-blue-500 text-white" onClick={saveScene}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pop-up personalizado para cargar escena */}
          {showLoadSceneModal && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded shadow-lg w-80 relative">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                  onClick={closeLoadSceneModal}
                >
                  &#x2715;
                </button>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-4">Cargar Escena</h2>
                  <select
                    className="border p-2 rounded w-full mb-4"
                    value={selectedScene}
                    onChange={(e) => setSelectedScene(e.target.value)}
                  >
                    {availableScenes.map((scene: any) => (
                      <option key={scene.id} value={scene.name}>
                        {scene.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="w-full border p-2 rounded bg-green-500 text-white"
                    onClick={loadSelectedScene}
                  >
                    Cargar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Render de las cards clickeables */}
          {statsToDisplay.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {statsToDisplay.map((stat) => {
                const dailyValues = groupDataByDay(stat.data, rangeStart, rangeEnd);
                const total = dailyValues.reduce((acc, curr) => acc + curr, 0);

                // --- NUEVA LÓGICA PARA EL PROMEDIO ---
                // 1. Definir el inicio del filtro
                let effectiveStartDate = rangeStart < initialDate ? initialDate : rangeStart;
                // 2. Si para esta estadística hay una fecha de implementación (y es posterior a effectiveStartDate), usarla
                const implDate = implementedSince[stat.label as Entities];
                if (implDate !== undefined && implDate > effectiveStartDate) {
                  effectiveStartDate = implDate;
                }
                // 3. Calcular el índice dentro del array de días que corresponde al effectiveStartDate
                const effectiveIndex = Math.max(differenceInCalendarDays(effectiveStartDate, rangeStart), 0);
                const averagingDays = dailyValues.length - effectiveIndex;
                const sumForAvg = dailyValues.slice(effectiveIndex).reduce((sum, value) => sum + value, 0);
                const avg = averagingDays > 0 ? sumForAvg / averagingDays : 0;
                // ---------------------------------------

                return (
                  <div
                    key={stat.label}
                    className={`p-4 rounded shadow cursor-pointer ${
                      selectedStats.includes(stat.label) ? 'bg-[#f4f8ff]' : 'bg-white'
                    }`}
                    onClick={() => {
                      // Actualiza solo el estado de comparación (selectedStats)
                      if (selectedStats.includes(stat.label)) {
                        setSelectedStats((prev) => prev.filter((label) => label !== stat.label));
                      } else {
                        setSelectedStats((prev) => [...prev, stat.label]);
                      }
                    }}
                  >
                    <p className="font-semibold">{getDisplayName(stat.label)}</p>
                    <p className="mt-2 flex justify-between text-sm">
                      <span>
                        Total: <span className="font-bold">{total}</span>
                      </span>
                      <span>
                        Promedio: <span className="font-bold">{avg.toFixed(2)}</span>
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600">No hay stats seleccionadas</p>
          )}
        </div>

        {/* Mostrar gráfico combinado si hay al menos una card seleccionada para comparar;
            de lo contrario, se muestran los gráficos individuales correspondientes */}
        <div className="h-full mt-8">
          {isLoading ? (
            <Loader />
          ) : selectedStats.length > 0 ? (
            <CombinedStatsChart
              range={days}
              startDate={rangeStart}
              endDate={rangeEnd}
              statsData={stats
                .filter((stat) => selectedStats.includes(stat.label))
                .map((stat) => ({
                  label: getDisplayName(stat.label),
                  dailyValues: groupDataByDay(stat.data, rangeStart, rangeEnd),
                }))}
            />
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {statsToDisplay.map((stat) => {
                const dailyValues = groupDataByDay(stat.data, rangeStart, rangeEnd);
                return (
                  <StatsChart
                    key={stat.label}
                    range={days}
                    title={getDisplayName(stat.label)}
                    values={dailyValues}
                    labels={labels}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
