import React, { useEffect, useState } from 'react'
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import './styles/home.css'

const ProgressChart: React.FC = () => {
  const [dailyCalories, setDailyCalories] = useState<number>(0)
  const [targetCalories, setTargetCalories] = useState<number>(0)
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/get/daily/macros',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const { daily_calories, goal } = data
        setDailyCalories(daily_calories || 0)
        setTargetCalories(goal || 0)

        if (daily_calories > goal) {
          setWarning(
            `Warning: You have exceeded your calorie goal! ${daily_calories} of ${goal}`
          )
        } else {
          setWarning(null)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const progressPercentage = targetCalories
    ? (dailyCalories / targetCalories) * 100
    : 0

  const progress = progressPercentage > 100 ? 100 : progressPercentage

  const data = [{ name: 'Progress', value: progress }]

  return (
    <div className="macros-chart">
      <ResponsiveContainer width="100%" height={300}>
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
            {Math.round(progress)}%
          </text>
          <text>
          </text>
        </RadialBarChart>
      </ResponsiveContainer>

      {warning}
    </div>
  )
}

export default ProgressChart
