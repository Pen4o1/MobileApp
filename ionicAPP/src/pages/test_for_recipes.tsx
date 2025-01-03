import React, { useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonToast,
} from '@ionic/react'

const RecipeSearch: React.FC = () => {
  const [caloriesFrom, setCaloriesFrom] = useState<string>('')
  const [caloriesTo, setCaloriesTo] = useState<string>('')
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecipes = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        calories_from: caloriesFrom,
        calories_to: caloriesTo,
      })

      const response = await fetch(
        `http://127.0.0.1:8000/api/recipes/search?${params}`,
        {
          method: 'GET',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch recipes')
      }

      const data = await response.json()
      setRecipes(data.recipes?.recipe || [])
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recipe Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Calories From</IonLabel>
            <IonInput
              type="number"
              value={caloriesFrom}
              onIonChange={(e) => setCaloriesFrom(e.detail.value!)}
              placeholder="Min Calories"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Calories To</IonLabel>
            <IonInput
              type="number"
              value={caloriesTo}
              onIonChange={(e) => setCaloriesTo(e.detail.value!)}
              placeholder="Max Calories"
            />
          </IonItem>
        </IonList>
        <IonButton expand="block" onClick={fetchRecipes}>
          Search Recipes
        </IonButton>

        <IonLoading isOpen={loading} message="Loading recipes..." />
        <IonToast
          isOpen={!!error}
          duration={3000}
          onDidDismiss={() => setError(null)}
        />

        {recipes.length > 0 && (
          <IonList>
            {recipes.map((recipe: any) => (
              <IonItem key={recipe.recipe_id}>
                <IonLabel>
                  <h2>{recipe.recipe_name}</h2>
                  <p>{recipe.recipe_description}</p>
                  <p>{recipe.recipe_ingredients?.ingredient}</p>
                  <p>Calories: {recipe.recipe_nutrition?.calories}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  )
}

export default RecipeSearch
