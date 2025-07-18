import React, { useState, useEffect, useCallback } from 'react';
import { Search, Utensils, Heart, ChevronRight, XCircle, Loader2 } from 'lucide-react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch recipes based on search term
  const fetchRecipes = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // TheMealDB returns 'meals' as null if no results are found
      const meals = data.meals || [];

      // Map API data to our desired recipe structure
      const formattedRecipes = meals.map(meal => ({
        id: meal.idMeal,
        name: meal.strMeal,
        image: meal.strMealThumb,
        // Combine all ingredients (strIngredient1-20) and measures (strMeasure1-20)
        ingredients: Array.from({ length: 20 }, (_, i) => {
          const ingredient = meal[`strIngredient${i + 1}`];
          const measure = meal[`strMeasure${i + 1}`];
          return (ingredient && ingredient.trim() !== '' && ingredient.trim() !== 'null')
            ? `${measure && measure.trim() !== '' && measure.trim() !== 'null' ? measure.trim() + ' ' : ''}${ingredient.trim()}`
            : null;
        }).filter(Boolean), // Filter out nulls and empty strings
        instructions: meal.strInstructions,
        // TheMealDB doesn't provide prep/cook time or servings directly, so we'll omit or mock them
        prepTime: 'N/A', // Placeholder
        cookTime: 'N/A', // Placeholder
        servings: 'N/A', // Placeholder
      }));
      setFilteredRecipes(formattedRecipes);
    } catch (e) {
      console.error("Failed to fetch recipes:", e);
      setError("Failed to load recipes. Please try again later.");
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // Initial load or when search term changes
  useEffect(() => {
    // Fetch some default recipes on initial load (e.g., 'chicken')
    // or when the search term is empty, fetch a general list.
    // For a better UX, you might want to show popular recipes initially.
    if (searchTerm === '') {
      fetchRecipes('chicken'); // Default search
    } else {
      const debounceTimer = setTimeout(() => {
        fetchRecipes(searchTerm);
      }, 500); // Debounce search to avoid too many API calls

      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, fetchRecipes]);

  // Function to fetch full recipe details when a card is clicked
  const fetchRecipeDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const meal = data.meals ? data.meals[0] : null;

      if (meal) {
        const detailedRecipe = {
          id: meal.idMeal,
          name: meal.strMeal,
          image: meal.strMealThumb,
          ingredients: Array.from({ length: 20 }, (_, i) => {
            const ingredient = meal[`strIngredient${i + 1}`];
            const measure = meal[`strMeasure${i + 1}`];
            return (ingredient && ingredient.trim() !== '' && ingredient.trim() !== 'null')
              ? `${measure && measure.trim() !== '' && measure.trim() !== 'null' ? measure.trim() + ' ' : ''}${ingredient.trim()}`
              : null;
          }).filter(Boolean),
          instructions: meal.strInstructions,
          prepTime: 'N/A', // TheMealDB doesn't provide these directly
          cookTime: 'N/A',
          servings: 'N/A',
          // You can add more details from the API here if needed, e.g., meal.strCategory, meal.strArea, meal.strYoutube
        };
        setSelectedRecipe(detailedRecipe);
      } else {
        setError("Recipe details not found.");
        setSelectedRecipe(null);
      }
    } catch (e) {
      console.error("Failed to fetch recipe details:", e);
      setError("Failed to load recipe details. Please try again later.");
      setSelectedRecipe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRecipeClick = (recipeId) => {
    fetchRecipeDetails(recipeId);
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
    setError(null); // Clear any errors when closing details
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-title-group">
          <Utensils className="header-icon" />
          <h1 className="app-title">Recipe Finder</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className="search-icon" />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {loading && (
          <div className="loading-indicator">
            <Loader2 className="loading-spinner" />
            <p>Loading recipes...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <XCircle className="error-icon" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          selectedRecipe ? (
            // Recipe Details View
            <div className="recipe-details-view animate-fade-in">
              <div className="details-header">
                <h2 className="details-title">{selectedRecipe.name}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="close-button"
                  aria-label="Close recipe details"
                >
                  <XCircle className="close-icon" />
                </button>
              </div>

              <div className="details-grid">
                <div className="details-image-section">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.name}
                    className="recipe-image"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/CCCCCC/333?text=No+Image"; }}
                  />
                  <div className="quick-facts-box">
                    <h3 className="quick-facts-title">Quick Facts</h3>
                    <ul className="quick-facts-list">
                      <li><span className="quick-fact-label">Prep Time:</span> {selectedRecipe.prepTime}</li>
                      <li><span className="quick-fact-label">Cook Time:</span> {selectedRecipe.cookTime}</li>
                      <li><span className="quick-fact-label">Servings:</span> {selectedRecipe.servings}</li>
                    </ul>
                  </div>
                </div>

                <div className="details-content-section">
                  <div className="ingredients-section">
                    <h3 className="section-title">
                      <Heart className="section-icon" /> Ingredients
                    </h3>
                    <ul className="ingredients-list">
                      {selectedRecipe.ingredients.length > 0 ? (
                        selectedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))
                      ) : (
                        <li>No ingredients listed.</li>
                      )}
                    </ul>
                  </div>

                  <div className="instructions-section">
                    <h3 className="section-title">
                      <Utensils className="section-icon" /> Instructions
                    </h3>
                    <ol className="instructions-list">
                      {selectedRecipe.instructions && selectedRecipe.instructions.split('\n').filter(line => line.trim() !== '').length > 0 ? (
                        selectedRecipe.instructions.split('\n').filter(line => line.trim() !== '').map((instruction, index) => (
                          <li key={index}>{instruction.trim()}</li>
                        ))
                      ) : (
                        <li>No instructions available.</li>
                      )}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Recipe List View
            <div className="recipe-list-grid">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    className="recipe-card"
                    onClick={() => handleRecipeClick(recipe.id)} // Pass ID for detailed fetch
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="recipe-card-image"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/CCCCCC/333?text=No+Image"; }}
                    />
                    <div className="recipe-card-content">
                      <h3 className="recipe-card-title">{recipe.name}</h3>
                      <p className="recipe-card-ingredients">
                        {recipe.ingredients.join(', ')}
                      </p>
                      <button className="view-recipe-button">
                        View Recipe <ChevronRight className="view-recipe-icon" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-recipes-found">
                  <p>No recipes found for "{searchTerm}". Try a different search!</p>
                </div>
              )}
            </div>
          )
        )}
      </main>

      {/* Standard CSS */}
      <style>
        {`
        /* Universal Box-Sizing for consistent layout */
        *, *::before, *::after {
          box-sizing: border-box;
        }

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #eff6ff, #e0e7ff); /* from-blue-50 to-indigo-100 */
          padding: 1rem; /* p-4 */
        }

        @media (min-width: 640px) { /* sm */
          .app-container {
            padding: 1.5rem; /* sm:p-6 */
          }
        }

        @media (min-width: 1024px) { /* lg */
          .app-container {
            padding: 2rem; /* lg:p-8 */
          }
        }

        .app-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          background-color: #fff;
          padding: 1rem; /* p-4 */
          border-radius: 1rem; /* rounded-2xl */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          margin-bottom: 2rem; /* mb-8 */
          max-width: 72rem; /* max-w-6xl */
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 640px) { /* sm */
          .app-header {
            flex-direction: row;
            padding: 1.5rem; /* sm:p-6 */
          }
        }

        .header-title-group {
          display: flex;
          align-items: center;
          margin-bottom: 1rem; /* mb-4 */
        }

        @media (min-width: 640px) { /* sm */
          .header-title-group {
            margin-bottom: 0; /* sm:mb-0 */
          }
        }

        .header-icon {
          color: #4f46e5; /* text-indigo-600 */
          width: 2rem; /* w-8 */
          height: 2rem; /* h-8 */
          margin-right: 0.75rem; /* mr-3 */
        }

        @media (min-width: 640px) { /* sm */
          .header-icon {
            width: 2.5rem; /* sm:w-10 */
            height: 2.5rem; /* sm:h-10 */
          }
        }

        .app-title {
          font-size: 1.875rem; /* text-3xl */
          font-weight: 800; /* font-extrabold */
          color: #4338ca; /* text-indigo-700 */
        }

        @media (min-width: 640px) { /* sm */
          .app-title {
            font-size: 2.25rem; /* sm:text-4xl */
          }
        }

        .search-container {
          position: relative;
          width: 90%; /* Adjusted for smaller screens */
          max-width: 400px; /* Prevent it from getting too wide on small/medium screens */
          margin: 0 auto; /* Center the search container */
        }

        @media (min-width: 640px) { /* sm */
          .search-container {
            width: 50%; /* sm:w-1/2 */
            max-width: none; /* Remove max-width on larger screens */
            margin: 0; /* Remove auto margin on larger screens */
          }
        }

        @media (min-width: 1024px) { /* lg */
          .search-container {
            width: 33.333333%; /* lg:w-1/3 */
          }
        }

        .search-input {
          width: 100%; /* w-full */
          padding-left: 3rem; /* pl-12 */
          padding-right: 1rem; /* pr-4 */
          padding-top: 0.75rem; /* py-3 */
          padding-bottom: 0.75rem; /* py-3 */
          border-radius: 9999px; /* rounded-full */
          border: 1px solid #d1d5db; /* border border-gray-300 */
          font-size: 1.125rem; /* text-lg */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          transition: all 0.3s ease-in-out; /* transition-all duration-300 */
        }

        .search-input:focus {
          outline: none;
          border-color: transparent; /* focus:border-transparent */
          box-shadow: 0 0 0 2px #818cf8; /* focus:ring-2 focus:ring-indigo-400 */
        }

        .search-icon {
          position: absolute;
          left: 1rem; /* left-4 */
          top: 50%; /* top-1/2 */
          transform: translateY(-50%); /* -translate-y-1/2 */
          color: #9ca3af; /* text-gray-400 */
          width: 1.5rem; /* w-6 */
          height: 1.5rem; /* h-6 */
        }

        .main-content {
          max-width: 72rem; /* max-w-6xl */
          margin-left: auto;
          margin-right: auto;
        }

        /* Loading and Error States */
        .loading-indicator, .error-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #fff;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          text-align: center;
          min-height: 200px; /* Ensure it takes up some space */
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          color: #4f46e5;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        .error-icon {
          width: 3rem;
          height: 3rem;
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .loading-indicator p, .error-message p {
          font-size: 1.125rem;
          color: #6b7280;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Recipe Details View */
        .recipe-details-view {
          background-color: #fff;
          padding: 1.5rem; /* p-6 */
          border-radius: 1rem; /* rounded-2xl */
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-xl */
          border: 1px solid #c7d2fe; /* border border-indigo-200 */
        }

        @media (min-width: 640px) { /* sm */
          .recipe-details-view {
            padding: 2rem; /* sm:p-8 */
          }
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .details-title {
          font-size: 1.875rem; /* text-3xl */
          font-weight: 700; /* font-bold */
          color: #4338ca; /* text-indigo-700 */
        }

        @media (min-width: 640px) { /* sm */
          .details-title {
            font-size: 2.25rem; /* sm:text-4xl */
          }
        }

        .close-button {
          padding: 0.5rem; /* p-2 */
          border-radius: 9999px; /* rounded-full */
          background-color: #fee2e2; /* bg-red-100 */
          color: #dc2626; /* text-red-600 */
          transition: background-color 0.3s ease-in-out; /* transition-colors duration-300 */
        }

        .close-button:hover {
          background-color: #fecaca; /* hover:bg-red-200 */
        }

        .close-icon {
          width: 1.75rem; /* w-7 */
          height: 1.75rem; /* h-7 */
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr; /* grid-cols-1 */
          gap: 2rem; /* gap-8 */
        }

        @media (min-width: 1024px) { /* lg */
          .details-grid {
            grid-template-columns: repeat(2, 1fr); /* lg:grid-cols-2 */
          }
        }

        .details-image-section {
          /* No specific order by default, handled by grid-column-reverse for lg */
        }

        @media (min-width: 1024px) { /* lg */
          .details-image-section {
            order: 2; /* lg:order-2 */
          }
        }

        .recipe-image {
          width: 100%; /* w-full */
          height: 16rem; /* h-64 */
          object-fit: cover; /* object-cover */
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
          margin-bottom: 1.5rem; /* mb-6 */
        }

        @media (min-width: 640px) { /* sm */
          .recipe-image {
            height: 20rem; /* sm:h-80 */
          }
        }

        .quick-facts-box {
          background-color: #eef2ff; /* bg-indigo-50 */
          padding: 1rem; /* p-4 */
          border-radius: 0.75rem; /* rounded-xl */
          margin-bottom: 1.5rem; /* mb-6 */
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); /* shadow-inner */
        }

        .quick-facts-title {
          font-size: 1.25rem; /* text-xl */
          font-weight: 600; /* font-semibold */
          color: #3730a3; /* text-indigo-800 */
          margin-bottom: 0.75rem; /* mb-3 */
        }

        .quick-facts-list {
          font-size: 1.125rem; /* text-lg */
          color: #4b5563; /* text-gray-700 */
          list-style: none; /* Remove default list style */
          padding: 0;
          margin: 0;
        }

        .quick-facts-list li {
          margin-bottom: 0.5rem; /* space-y-2 */
        }

        .quick-fact-label {
          font-weight: 500; /* font-medium */
        }

        .details-content-section {
          /* No specific order by default, handled by grid-column-reverse for lg */
        }

        @media (min-width: 1024px) { /* lg */
          .details-content-section {
            order: 1; /* lg:order-1 */
          }
        }

        .ingredients-section {
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .section-title {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 600; /* font-semibold */
          color: #4338ca; /* text-indigo-700 */
          margin-bottom: 1rem; /* mb-4 */
          display: flex;
          align-items: center;
        }

        .section-icon {
          width: 1.5rem; /* w-6 */
          height: 1.5rem; /* h-6 */
          margin-right: 0.5rem; /* mr-2 */
        }

        .ingredients-section .section-icon {
          color: #ef4444; /* text-red-500 */
        }

        .instructions-section .section-icon {
          color: #22c55e; /* text-green-600 */
        }

        .ingredients-list, .instructions-list {
          font-size: 1.125rem; /* text-lg */
          color: #4b5563; /* text-gray-700 */
          background-color: #f9fafb; /* bg-gray-50 */
          padding: 1rem; /* p-4 */
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); /* shadow-inner */
          list-style-position: inside;
        }

        .ingredients-list {
          list-style-type: disc;
        }

        .instructions-list {
          list-style-type: decimal;
        }

        .ingredients-list li, .instructions-list li {
          margin-bottom: 0.75rem; /* space-y-2 (for ingredients) / space-y-3 (for instructions) */
        }

        /* Recipe List View */
        .recipe-list-grid {
          display: grid;
          grid-template-columns: 1fr; /* grid-cols-1 */
          gap: 1.5rem; /* gap-6 */
        }

        @media (min-width: 640px) { /* sm */
          .recipe-list-grid {
            grid-template-columns: repeat(2, 1fr); /* sm:grid-cols-2 */
          }
        }

        @media (min-width: 1024px) { /* lg */
          .recipe-list-grid {
            grid-template-columns: repeat(3, 1fr); /* lg:grid-cols-3 */
          }
        }

        .recipe-card {
          background-color: #fff;
          border-radius: 1rem; /* rounded-2xl */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
          transition: all 0.3s ease-in-out; /* transition-all duration-300 */
          cursor: pointer;
          overflow: hidden;
          border: 1px solid #e5e7eb; /* border border-gray-200 */
        }

        .recipe-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* hover:shadow-xl */
          transform: translateY(-0.25rem); /* hover:-translate-y-1 */
        }

        .recipe-card-image {
          width: 100%; /* w-full */
          height: 12rem; /* h-48 */
          object-fit: cover; /* object-cover */
          object-position: center; /* object-center */
          border-top-left-radius: 1rem; /* rounded-t-2xl */
          border-top-right-radius: 1rem; /* rounded-t-2xl */
        }

        .recipe-card-content {
          padding: 1.25rem; /* p-5 */
        }

        .recipe-card-title {
          font-size: 1.25rem; /* text-xl */
          font-weight: 700; /* font-bold */
          color: #4338ca; /* text-indigo-700 */
          margin-bottom: 0.5rem; /* mb-2 */
        }

        .recipe-card-ingredients {
          color: #4b5563; /* text-gray-600 */
          font-size: 0.875rem; /* text-sm */
          margin-bottom: 1rem; /* mb-4 */
          display: -webkit-box;
          -webkit-line-clamp: 2; /* line-clamp-2 */
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .view-recipe-button {
          display: flex;
          align-items: center;
          color: #4f46e5; /* text-indigo-600 */
          font-weight: 600; /* font-semibold */
          transition: color 0.2s ease-in-out; /* transition-colors duration-200 */
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .view-recipe-button:hover {
          color: #3730a3; /* hover:text-indigo-800 */
        }

        .view-recipe-icon {
          margin-left: 0.25rem; /* ml-1 */
          width: 1.25rem; /* w-5 */
          height: 1.25rem; /* h-5 */
        }

        .no-recipes-found {
          grid-column: 1 / -1; /* col-span-full */
          text-align: center;
          padding-top: 2.5rem; /* py-10 */
          padding-bottom: 2.5rem; /* py-10 */
          background-color: #fff;
          border-radius: 1rem; /* rounded-2xl */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
        }

        .no-recipes-found p {
          font-size: 1.25rem; /* text-xl */
          color: #6b7280; /* text-gray-500 */
        }

        /* Animations */
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
}

export default App;