// ** React
import { useEffect, useState } from 'react';

// ** Components
import Loader from 'components/general/Loader';
import CombinedStatsChart from 'components/charts/CombinatedStatsChart';
import StatsChart from 'components/charts/StatsChart';

// ** Services
import { SERVICES } from 'services/index';

// ** Types
import { Entities } from 'types/dynamicSevicesTypes';

// Función para formatear el label: quita "stats_", inserta espacios y capitaliza cada palabra
const formatLabel = (label: string): string => {
  const withoutPrefix = label.replace(/^stats_/, '');
  const withSpaces = withoutPrefix.replace(/([A-Z])/g, ' $1').trim();
  return withSpaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const DashboardView = () => {
  const [stats, setStats] = useState<{ label: string; data: { date: Date; value: number }[] }[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Esta semana');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStats, setSelectedStats] = useState<string[]>([]);

  const filters = ['Últimos 7 días', 'Últimos 30 días', 'Últimos 90 días'];

  // Retorna el número de días según el filtro seleccionado
  const getDaysFromFilter = (filter: string): 7 | 30 | 90 => {
    if (filter === 'Últimos 30 días') return 30;
    if (filter === 'Últimos 90 días') return 90;
    return 7; // Por defecto "Esta semana"
  };

  // Obtiene el rango de fechas: el último día es el momento actual y el primero es (n-1) días atrás
  const getRange = (days: number): [Date, Date] => {
    const now = new Date();
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

  // Crea las etiquetas para el eje X en formato dd/MM
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

  // Función para obtener los datos de cada entidad
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
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">DASHBOARD</h1>
      <div className="p-4 bg-gray-50 rounded shadow">
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

        {/* Cards clickeables */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat) => {
            const total = stat.data.reduce((acc, curr) => acc + curr.value, 0);
            const formattedLabel = formatLabel(stat.label);
            const isSelected = selectedStats.includes(stat.label);

            return (
              <div
                key={stat.label}
                className={`p-4 rounded shadow cursor-pointer ${isSelected ? 'bg-blue-100' : 'bg-white'}`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedStats((prev) => prev.filter((label) => label !== stat.label));
                  } else {
                    setSelectedStats((prev) => [...prev, stat.label]);
                  }
                }}
              >
                <p>{formattedLabel}</p>
                <h3 className="text-xl font-bold">{total}</h3>
              </div>
            );
          })}
        </div>

        {/* Si hay alguna card seleccionada se muestra el gráfico combinado;
          si no, se muestran todos los gráficos individuales (uno por serie) */}
        {selectedStats.length > 0 ? (
          <CombinedStatsChart
            range={days}
            startDate={rangeStart}
            endDate={rangeEnd}
            statsData={stats
              .filter((stat) => selectedStats.includes(stat.label))
              .map((stat) => ({
                label: formatLabel(stat.label),
                dailyValues: groupDataByDay(stat.data, rangeStart, rangeEnd),
              }))}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {stats.map((stat) => {
              const dailyValues = groupDataByDay(stat.data, rangeStart, rangeEnd);
              const formattedLabel = formatLabel(stat.label);
              return (
                <StatsChart
                  key={stat.label}
                  range={days}
                  title={formattedLabel}
                  values={dailyValues}
                  labels={labels}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
