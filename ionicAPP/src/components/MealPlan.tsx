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
  IonList,
  IonLoading,
  IonToast,
  IonAccordion,
  IonAccordionGroup,
} from '@ionic/react'

type Recipe = {
  recipe_name: string
  recipe_description: string
  recipe_ingredients: { ingredient: string[] }
  recipe_nutrition: { calories: string }
}

type MealPlanResponse = {
  meal_plan: {
    recipe: Recipe[] 
  }[]
}

const SetMealPlan: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [meals_per_day, setMeals_per_day] = useState(3)
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      const payload = { meals_per_day }
      const response = await fetch(
        'http://127.0.0.1:8000/api/generate/meal/plan',
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
        setMealPlan(data as MealPlanResponse) 
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

        <IonLoading isOpen={loading} message="Loading meal plan..." />

        {error && (
          <IonToast
            isOpen={!!error}
            message={error}
            duration={3000}
            onDidDismiss={() => setError(null)}
          />
        )}

        {mealPlan && mealPlan.meal_plan.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            {mealPlan.meal_plan.map((mealItem, index) => (
              <div key={index}>
                {mealItem.recipe.length > 0 ? (
                  <IonAccordionGroup>
                    {mealItem.recipe.map((recipe, recipeIndex) => (
                      <IonAccordion key={recipeIndex}>
                        <IonItem slot="header">
                          <IonLabel>{recipe.recipe_name} Meal number: {index + 1}</IonLabel>
                        </IonItem>
                        <div slot="content">
                          <p>{recipe.recipe_description}</p>
                          <p>Calories: {recipe.recipe_nutrition?.calories} kcal</p>
                          <p>
                            Ingredients:{' '}
                            {recipe.recipe_ingredients.ingredient.join(', ')}
                          </p>
                        </div>
                      </IonAccordion>
                    ))}
                  </IonAccordionGroup>
                ) : (
                  <p>No recipes available for this meal.</p>
                )}
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
  );
};

export default SetMealPlan;
