import StatsChart from 'components/charts/StatsChart';
import Loader from 'components/general/Loader';
import { useEffect, useState } from 'react';
import { SERVICES } from 'services/index';
import { Entities } from 'types/dynamicSevicesTypes';

const DashboardView = () => {
  const [stats, setStats] = useState<{ label: string; data: { date: Date; value: number }[] }[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Esta semana');
  const [isLoading, setIsLoading] = useState(true);

  const filters = ['Últimos 7 días', 'Últimos 30 días', 'Últimos 90 días'];

  // Retorna el número de días según el filtro seleccionado
  const getDaysFromFilter = (filter: string): 7 | 30 | 90 => {
    if (filter === 'Últimos 30 días') return 30;
    if (filter === 'Últimos 90 días') return 90;
    return 7; // Por defecto "Esta semana"
  };

  // Obtiene el rango de fechas: el último día es el momento actual y el primero es (n-1) días atrás
  const getRange = (days: number): [Date, Date] => {
    const now = new Date(); // Ahora mismo
    const start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
    return [start, now];
  };

  // Calcula la diferencia en días entre dos fechas (ignorando la hora)
  const differenceInCalendarDays = (d: Date, start: Date): number => {
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const dDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffTime = dDay.getTime() - startDay.getTime();
    return Math.floor(diffTime / (24 * 60 * 60 * 1000));
  };

  // Agrupa los datos por día usando la fecha real guardada
  const groupDataByDay = (items: { date: Date; value: number }[], start: Date, end: Date) => {
    const dayCount = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const dailyValues = Array(dayCount).fill(0);
    items.forEach((item) => {
      const itemDate = new Date(item.date);
      const diff = differenceInCalendarDays(itemDate, start);
      if (diff >= 0 && diff < dayCount) dailyValues[diff] += item.value;
    });
    return dailyValues;
  };

  // Crea las etiquetas para el eje X:
  // Para los primeros días muestra "MM/DD" y para el último la fecha y hora actuales.
  const createLabels = (start: Date, end: Date, days: number): string[] => {
    const labels: string[] = [];
    for (let i = 0; i < days - 1; i++) {
      const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      // Puedes ajustar el formato de la fecha a tus necesidades
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    labels.push(end.toLocaleString()); // Última etiqueta: fecha y hora actuales
    return labels;
  };

  const fetchStats = async () => {
    setIsLoading(true);
    const days = getDaysFromFilter(selectedFilter);
    const [startDate, endDate] = getRange(days);

    const promises = Object.keys(Entities)
      .filter((key) => key.startsWith('stats_'))
      .map(async (entity) => {
        const res = await SERVICES.CMS.get(Entities[entity as Entities], [
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

  useEffect(() => {
    fetchStats();
  }, [selectedFilter]);

  if (isLoading) return <Loader />;

  const days = getDaysFromFilter(selectedFilter);
  const [rangeStart, rangeEnd] = getRange(days);
  const labels = createLabels(rangeStart, rangeEnd, days);

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <h2 className="text-center font-semibold mb-4">Dashboard</h2>

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

      <div className="grid grid-cols-2 gap-4 mb-4">
        {stats.map((stat) => {
          const total = stat.data.reduce((acc, curr) => acc + curr.value, 0);
          return (
            <div key={stat.label} className="p-4 bg-white rounded shadow">
              <p>{stat.label.replace('stats_', '').replace(/([A-Z])/g, ' $1')}</p>
              <h3 className="text-xl font-bold">{total}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {stats.map((stat) => {
          const dailyValues = groupDataByDay(stat.data, rangeStart, rangeEnd);

          return (
            <StatsChart
              key={stat.label}
              range={days}
              title={stat.label
                .replace('stats_', '')
                .replace(/([A-Z])/g, ' $1')
                .toUpperCase()}
              values={dailyValues}
              labels={labels} // Se pasan las etiquetas para el eje X
            />
          );
        })}
      </div>
    </div>
  );
};

export default DashboardView;
