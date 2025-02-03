// ** DashboardView.tsx
import StatsChart from 'components/charts/StatsChart';
import Loader from 'components/general/Loader';
import { useEffect, useState } from 'react';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities } from 'types/dynamicSevicesTypes';

const DashboardView = () => {
  const [stats, setStats] = useState<
    {
      label: string;
      data: { date: Date; value: number }[];
    }[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState('Ayer');
  const [isLoading, setIsLoading] = useState(true);

  const filters = ['Ayer', 'Esta semana', 'Semana pasada', 'Últimos 30 días', 'Últimos 90 días'];

  // Devuelve [fechaInicio, fechaFin] según el filtro
  const getRange = (filter: string): [Date, Date] => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    switch (filter) {
      case 'Ayer':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        return [start, end];

      case 'Esta semana':
        {
          const dayOfWeek = now.getDay(); // domingo=0, lunes=1...
          const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          start.setDate(now.getDate() - diffToMonday);
          start.setHours(0, 0, 0, 0);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
        }
        return [start, end];

      case 'Semana pasada':
        {
          const currentDay = now.getDay();
          const diffToLastMonday = (currentDay === 0 ? 7 : currentDay) + 6;
          start.setDate(now.getDate() - diffToLastMonday);
          start.setHours(0, 0, 0, 0);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
        }
        return [start, end];

      case 'Últimos 30 días':
        start.setDate(now.getDate() - 30);
        return [start, end];

      case 'Últimos 90 días':
        start.setDate(now.getDate() - 90);
        return [start, end];

      default:
        return [start, end];
    }
  };

  // Para convertir el string del filtro a número de días
  const getNumericRange = (filter: string): 1 | 7 | 30 | 90 => {
    if (filter === 'Ayer') return 1;
    if (filter === 'Esta semana' || filter === 'Semana pasada') return 7;
    if (filter === 'Últimos 30 días') return 30;
    return 90;
  };

  // Agrupa los datos de cada estadística por día (según el rango) y devuelve un array con la suma diaria.
  const groupDataByDay = (items: { date: Date; value: number }[], range: number) => {
    const now = new Date();
    // Fecha de inicio = hoy - (range - 1) días
    const start = new Date(now);
    start.setDate(now.getDate() - (range - 1));
    start.setHours(0, 0, 0, 0);

    // Array para almacenar la suma por cada día
    const dailyValues = Array(range).fill(0);

    items.forEach((item) => {
      // Normalizamos la fecha del item
      const d = new Date(item.date);
      d.setHours(0, 0, 0, 0);

      // Diferencia en días desde el día de inicio
      const diff = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      // Si está dentro del rango, se acumula
      if (diff >= 0 && diff < range) {
        dailyValues[diff] += item.value;
      }
    });

    return dailyValues;
  };

  const fetchStats = async () => {
    setIsLoading(true);
    const [startDate, endDate] = getRange(selectedFilter);

    const promises = Object.keys(Entities)
      .filter((key) => key.startsWith('stats_'))
      .map(async (entity) => {
        const res = await SERVICES.CMS.get(Entities[entity as Entities], [
          { field: 'createdAt', operator: '>=', value: startDate },
          { field: 'createdAt', operator: '<=', value: endDate },
        ]);
        return { entity, data: res };
      });

    const results = await Promise.all(promises);

    const formattedStats = results
      .map(({ entity, data }) => {
        if (!data) return null;
        return {
          label: entity,
          data: data.map((item: any) => ({
            date: item.createdAt.toDate ? item.createdAt.toDate() : item.createdAt,
            value: item?.data ?? 0,
          })),
        };
      })
      .filter(Boolean) as {
      label: string;
      data: { date: Date; value: number }[];
    }[];

    setStats(formattedStats);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [selectedFilter]);

  if (isLoading) return <Loader />;

  const numericRange = getNumericRange(selectedFilter);
  const isAyer = numericRange === 1;

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <h2 className="text-center font-semibold mb-4">Dashboard</h2>

      <div className="my-4">
        <select
          className="border p-2 rounded w-full"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          {filters.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {stats.map((stat, idx) => {
          const total = stat.data.reduce((acc, curr) => acc + (curr.value || 0), 0);
          return (
            <div key={idx} className="p-4 bg-white rounded shadow">
              <p>{stat.label.replace('stats_', '').replace(/([A-Z])/g, ' $1')}</p>
              <h3 className="text-xl font-bold">{total}</h3>
            </div>
          );
        })}
      </div>

      {/* Si el usuario elige una opción más antigua que Ayer, mostramos los charts. */}
      {!isAyer && (
        <div className="grid grid-cols-1 gap-6">
          {stats.map((stat, idx) => {
            // Obtenemos un array con las sumas diarias
            const dailyValues = groupDataByDay(stat.data, numericRange);
            return (
              <StatsChart
                key={idx}
                range={numericRange}
                title={stat.label
                  .replace('stats_', '')
                  .replace(/([A-Z])/g, ' $1')
                  .toUpperCase()}
                values={dailyValues}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardView;
