import React, { useState } from 'react'

const MealPlan = () => {
  const [meals, setMeals] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleGenerateMealPlan = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http:///127.0.0.1:8000/api/get-meal', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Send an empty object as the request body
      })

      if (!response.ok) {
        throw new Error('Failed to fetch meal plan')
      }

      const data = await response.json()

      if (data && data.meals) {
        setMeals(data.meals)
      } else {
        setError('No meals found for the specified calorie range')
      }
    } catch (err) {
      setError('Failed to fetch meal plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleGenerateMealPlan} disabled={loading}>
        {loading ? 'Loading...' : 'Generate Meal Plan'}
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        {meals.length > 0 ? (
          <ul>
            {meals.map((meal: any, index: number) => (
              <li key={index}>
                <h4>{meal.recipe_name}</h4>
                <p>Calories: {meal.recipe_nutrition.calories}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meals found</p>
        )}
      </div>
    </div>
  )
}

export default MealPlan
