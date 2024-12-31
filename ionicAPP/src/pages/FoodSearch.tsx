import React, { useState } from 'react'

const FoodSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const searchFoods = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `http://localhost:8000/api/foods/search?query=${encodeURIComponent(
          query
        )}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()
      setResults(data.foods.food || [])
    } catch (err: any) {
      setError(err.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Food Search</h1>
      <input
        type="text"
        placeholder="Search for food..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      />
      <button
        onClick={searchFoods}
        disabled={!query.trim() || loading}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <ul style={{ marginTop: '20px', listStyle: 'none', padding: '0' }}>
        {results.map((food, index) => (
          <li
            key={index}
            style={{
              padding: '10px',
              borderBottom: '1px solid #ccc',
            }}
          >
            <strong>{food.food_name}</strong>
            <p>{food.food_description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FoodSearch
