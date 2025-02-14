// ** React
import React, { useEffect, useRef, useState } from 'react';

// ** Chart library
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type CombinedStatsChartProps = {
  range: number;
  startDate: Date;
  endDate: Date;
  statsData: { label: string; dailyValues: number[] }[];
};

const CombinedStatsChart: React.FC<CombinedStatsChartProps> = ({ range, startDate, endDate, statsData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.width / 2.5,
        });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => {
      if (containerRef.current) ro.unobserve(containerRef.current);
    };
  }, []);

  // Arma un arreglo de objetos, uno por día, combinando las series seleccionadas
  const data = Array.from({ length: range }, (_, i) => {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const obj: any = { date: date.getTime() };
    statsData.forEach((stat) => {
      obj[stat.label] = stat.dailyValues[i] || 0;
    });
    return obj;
  });

  // Paleta de colores para cada serie
  const colors = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EF5350', '#26A69A'];

  return (
    <div ref={containerRef} className="w-full bg-white shadow rounded p-4 mb-4">
      <h2 className="text-lg font-bold mb-4">Gráfico Combinado</h2>
      <div className="w-full" style={{ height: dimensions.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.3)" />
            <XAxis
              dataKey="date"
              type="number"
              domain={['dataMin', 'dataMax']}
              scale="time"
              tick={{ fill: '#000', fontSize: 12 }}
              tickFormatter={(timestamp: number) => {
                const d = new Date(timestamp);
                const day = d.getDate().toString().padStart(2, '0');
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                return `${day}/${month}`;
              }}
            />
            <YAxis tick={{ fill: '#000', fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string) => [value, name]}
              labelFormatter={(label) => {
                const d = new Date(label);
                const day = d.getDate().toString().padStart(2, '0');
                const month = (d.getMonth() + 1).toString().padStart(2, '0');
                return `${day}/${month}`;
              }}
            />
            <Legend />
            {statsData.map((stat, index) => (
              <Area
                key={stat.label}
                type="monotone"
                dataKey={stat.label}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                activeDot={{ r: 6 }}
                dot={{ fill: 'white', stroke: colors[index % colors.length], r: 3 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CombinedStatsChart;
