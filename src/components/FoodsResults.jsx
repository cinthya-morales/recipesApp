import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchContext from '../context/searchContext';
import { getFoodRecipes,
  fetchFoodsByCategory, getFoodListByIngredient } from '../services/fetchAPI';
import ResultsList from './ResultsList';

function FoodsResults() {
  const { state } = useLocation();
  const { foodsList, setFoodsList,
    foodsCategoryList } = useContext(SearchContext);

  const [filtered, setFiltered] = useState('');

  const [filterByIngredient, setFilterByIngredient] = useState([]);

  const [ingredientCheck, setIngredientCheck] = useState(false);

  const maxNumber = 12;
  const MAX_CATEGORY = 5;

  const filterCategory = async (category) => {
    if (filtered !== category && category !== 'All') {
      const foodsByCategoryData = await fetchFoodsByCategory(category);
      setFoodsList(foodsByCategoryData);
      setFiltered(category);
    } else {
      const allFoods = await getFoodRecipes();
      setFoodsList(allFoods);
      setFiltered('');
    }
  };

  useEffect(() => {
    const fetchIngredient = async () => {
      if (state?.ingredient) {
        const data = await getFoodListByIngredient(state.ingredient);
        setFilterByIngredient(data);
        setIngredientCheck(true);
      }
    };
    fetchIngredient();
    return () => setFoodsList([]);
  }, []);

  return (
    <main>
      <section>
        <button
          type="button"
          data-testid="All-category-filter"
          value="All"
          onClick={ (event) => filterCategory(event.target.value) }
        >
          All
        </button>
        {foodsCategoryList
          .slice(0, MAX_CATEGORY)
          .map((elem, index) => (
            <button
              key={ index }
              type="button"
              data-testid={ `${elem.strCategory}-category-filter` }
              value={ elem.strCategory }
              onClick={ (event) => filterCategory(event.target.value) }
            >
              {elem.strCategory}
            </button>
          ))}
      </section>

      {ingredientCheck
        ? filterByIngredient
          .slice(0, maxNumber)
          .map((food, index) => (
            <ResultsList key={ index } data={ food } index={ index } />
          )) : (
          foodsList.length > 0
          && foodsList
            .slice(0, maxNumber)
            .map((food, index) => (
              <ResultsList key={ index } data={ food } index={ index } />)))}

    </main>
  );
}

export default FoodsResults;
