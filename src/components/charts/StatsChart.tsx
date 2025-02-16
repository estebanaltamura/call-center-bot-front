// ** React
import React, { useEffect, useRef, useState } from 'react';

// ** Chart library
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type StatsChartProps = {
  range: number;
  title: string;
  values: number[];
  labels: string[];
};

const StatsChart: React.FC<StatsChartProps> = ({ range, title, values, labels }) => {
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

  // Arma los datos: cada objeto representa un día, usando las etiquetas y los valores
  const data = Array.from({ length: range }, (_, i) => ({
    date: labels[i],
    value: values[i] || 0,
  }));

  return (
    <div ref={containerRef} className="w-full bg-[#f4f8ff] shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="w-full" style={{ height: dimensions.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,200,200,0.3)" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#000', fontSize: 12 }}
              tickFormatter={(value: string) => value}
            />
            <YAxis tick={{ fill: '#000', fontSize: 12 }} />
            <Tooltip formatter={(value: number) => [value, title]} labelFormatter={(label) => label} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#42A5F5"
              fill="rgba(66, 165, 245, 0.3)"
              activeDot={{ r: 6 }}
              dot={{ fill: 'white', stroke: '#42A5F5', r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsChart;
