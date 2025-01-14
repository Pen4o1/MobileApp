import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './styles/home.css';

const COLORS = ['#FFBB28', '#0088FE', '#00C49F'];

const MacrosChart: React.FC = () => {
  const [data, setData] = useState([
    { name: 'Fats', value: 0 },
    { name: 'Carbs', value: 0 },
    { name: 'Proteins', value: 0 },
  ]);

  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/get/daily/macros', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch macros data.');
        }

        const result = await response.json();

        const fetchedData = [
          { name: 'Fats', value: result.fat_consumed },
          { name: 'Carbs', value: result.carbohydrate_consumed },
          { name: 'Proteins', value: result.protein_consumed },
        ];

        // Check if all values are zero, and if so, set a demo dataset
        const isAllZero = fetchedData.every((item) => item.value === 0);
        if (isAllZero) {
          setData([
            { name: 'Fats', value: 30 },
            { name: 'Carbs', value: 50 },
            { name: 'Proteins', value: 20 },
          ]);
        } else {
          setData(fetchedData);
        }
      } catch (error: any) {
        setError(error.message || 'An error occurred.');
      }
    };

    fetchData();
  }, []);

  const handleClick = (data: any, index: number) => {
    setSelectedSegment(`${data.name}: ${data.value}`);
  };

  return (
    <div className="macros-chart">
      {error && <p className="error-message">{error}</p>}
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
            onClick={handleClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {selectedSegment && (
        <div className="selected-segment-info">
          <p className="segment-info">
            You clicked on: <strong>{selectedSegment}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default MacrosChart;
