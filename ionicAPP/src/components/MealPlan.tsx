import React, { useState } from 'react';
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
  IonLoading,
  IonToast,
  IonAccordion,
  IonAccordionGroup,
} from '@ionic/react';

type Ingredient = { ingredient: string[] };
type Nutrition = { calories: string };

type Recipe = {
  recipe_name: string;
  recipe_description: string;
  recipe_ingredients: Ingredient;
  recipe_nutrition: Nutrition;
};

type CombinedMeal = {
  combined_recipes: Recipe[];
  total_calories: number;
};

type Meal = Recipe | CombinedMeal;

type MealPlanResponse = {
  meal_plan: Meal[];
};

const SetMealPlan: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = { meals_per_day: mealsPerDay };
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
      );

      if (response.ok) {
        const data = await response.json();
        setMealPlan(data as MealPlanResponse);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate meal plan');
      }
    } catch (error) {
      setError('An error occurred while generating the meal plan.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMeal = (meal: Meal, index: number) => {
    if ('combined_recipes' in meal) {
      // Render combined recipes
      return (
        <IonAccordion key={index}>
          <IonItem slot="header">
            <IonLabel>Meal {index + 1}: Combined Meal</IonLabel>
          </IonItem>
          <div slot="content">
            <p>Total Calories: {meal.total_calories} kcal</p>
            {meal.combined_recipes.map((recipe, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <h3>Recipe {i + 1}: {recipe.recipe_name}</h3>
                <p>{recipe.recipe_description}</p>
                <p>Calories: {recipe.recipe_nutrition.calories} kcal</p>
                <p>
                  Ingredients: {recipe.recipe_ingredients.ingredient.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </IonAccordion>
      );
    } else {
      // Render single recipe
      return (
        <IonAccordion key={index}>
          <IonItem slot="header">
            <IonLabel>
              Meal {index + 1}: {meal.recipe_name}
            </IonLabel>
          </IonItem>
          <div slot="content">
            <p>{meal.recipe_description}</p>
            <p>Calories: {meal.recipe_nutrition.calories} kcal</p>
            <p>
              Ingredients: {meal.recipe_ingredients.ingredient.join(', ')}
            </p>
          </div>
        </IonAccordion>
      );
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Set Meal Plan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonItem>
          <IonLabel position="floating">How many meals a day?</IonLabel>
          <IonInput
            type="number"
            value={mealsPerDay}
            onIonChange={(e) => setMealsPerDay(Number(e.detail.value!))}
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
            <IonAccordionGroup>
              {mealPlan.meal_plan.map((meal, index) => renderMeal(meal, index))}
            </IonAccordionGroup>
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
