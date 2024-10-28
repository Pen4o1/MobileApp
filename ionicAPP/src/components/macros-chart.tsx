import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './styles/home.css'; 

const data = [
  { name: 'Proteins', value: 400 },
  { name: 'Fats', value: 300 },
  { name: 'Carbs', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const MacrosChart: React.FC = () => {
  return (
    <div className="macros-chart"> 
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacrosChart;
