import React, { useState } from 'react'
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonFooter,
} from '@ionic/react'

type MealItem = {
  name: string
  calories: number
}

type MealPlan = {
  [meal: string]: MealItem[]
}

const SetMealPlan: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [meals_per_day, setMeals_per_day] = useState(3) 
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      const payload = { meals_per_day } 
      const response = await fetch(
        'http://127.0.0.1:8000/api/generate-meal-plan',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (response.ok) {
        const data = await response.json()
        setMealPlan(data.meal_plan)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to generate meal plan')
      }
    } catch (error) {
      setError('An error occurred while generating the meal plan.')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Set Meal Plan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonItem>
          <IonLabel position="floating">
            How many meals a day would you have
          </IonLabel>
          <IonInput
            type="number"
            value={meals_per_day}
            onIonChange={(e) => setMeals_per_day(Number(e.detail.value!))}
            disabled={loading}
            min={1} 
            max={6} 
          />
        </IonItem>

        <IonButton expand="block" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </IonButton>

        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <p>{error}</p>
          </div>
        )}

        {mealPlan && (
          <div style={{ marginTop: '20px' }}>
            <h2>Meal Plan</h2>
            {Object.keys(mealPlan).map((meal) => (
              <div key={meal}>
                <h3>{meal}</h3>
                <ul>
                  {mealPlan[meal].map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.calories} kcal
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButton expand="full" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  )
}

export default SetMealPlan
