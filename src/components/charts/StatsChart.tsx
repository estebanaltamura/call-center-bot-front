import React, { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Props = {
  range: 1 | 7 | 30 | 90;
  title: string;
  values: number[];
};

const StatsChart: React.FC<Props> = ({ range, title, values }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const getDataForRange = (vals: number[]) => {
    const totalDays = range;

    // Fecha de referencia: Ayer a medianoche (sin horas/minutos)
    const referenceDay = new Date();
    referenceDay.setDate(referenceDay.getDate() - 1); // Ayer
    referenceDay.setHours(0, 0, 0, 0); // Resetear a medianoche

    // Generar array de fechas desde (ayer - (totalDays - 1)) hasta ayer
    const dates = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(referenceDay);
      date.setDate(date.getDate() - (totalDays - 1 - i));
      return date.getTime();
    });

    // Alinear valores con las fechas generadas (valores[0] corresponde a la fecha más antigua)
    const paddedValues = Array(totalDays).fill(0);
    const valuesToUse = values.slice(-totalDays); // Tomar los últimos N valores

    valuesToUse.forEach((value, index) => {
      paddedValues[index] = value;
    });

    return dates.map((date, index) => ({
      date,
      value: paddedValues[index],
    }));
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: number;
  }) => {
    if (active && payload && payload.length) {
      const displayDate = new Date(label ?? 0).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      });
      return (
        <div className="flex flex-col bg-white border border-gray-300 rounded p-2 text-sm shadow">
          <span className="font-bold mb-1">{displayDate}</span>
          <span className="text-gray-700">
            {title}: {payload[0].value}
          </span>
        </div>
      );
    }
    return null;
  };

  const chartData = getDataForRange(values);

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

  return (
    <div ref={containerRef} className="w-full bg-white shadow rounded p-4 mb-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="w-full" style={{ height: dimensions.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.3)" />
            <XAxis
              dataKey="date"
              type="number"
              domain={['dataMin', 'dataMax']}
              scale="time"
              tick={{ fill: '#000', fontSize: 12 }}
              tickFormatter={(timestamp: number) => {
                const d = new Date(timestamp);
                return `${d.getDate()} ${months[d.getMonth()]}`;
              }}
            />
            <YAxis tick={{ fill: '#000', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              name={title}
              stroke="#42A5F5"
              fill="rgba(66, 165, 245, 0.3)"
              activeDot={{ r: 6 }}
              dot={{
                fill: 'white',
                stroke: '#42A5F5',
                r: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsChart;
