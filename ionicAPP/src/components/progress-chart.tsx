import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import './styles/home.css';

interface RadialBarChartComponentProps {
    value: number; 
}

const ProgressChart: React.FC<RadialBarChartComponentProps> = ({ value }) => {
    const data = [{ name: 'Progress', value }];

    return (
        <div className="macros-chart">
            <ResponsiveContainer>
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    barSize={20}
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                    />
                    <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={18}
                        fill="#57b9ff"
                    />
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="progress-label"
                    >
                        {value}
                    </text>
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgressChart;
