import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchContext from '../context/searchContext';
import { fetchDrinksByCategory,
  getDrinksRecipes, getDrinkListByIngredient } from '../services/fetchAPI';

function DrinksResults() {
  const { drinksList, setDrinksList,
    drinksCategoryList } = useContext(SearchContext);

  const [filtered, setFiltered] = useState('');

  const { state } = useLocation();

  const maxNumber = 12;
  const MAX_CATEGORY = 5;

  const filterCategory = async (category) => {
    if (filtered !== category && category !== 'All') {
      const drinksByCategoryData = await fetchDrinksByCategory(category);
      setDrinksList(drinksByCategoryData);
      setFiltered(category);
    } else {
      const allDrinks = await getDrinksRecipes();
      setDrinksList(allDrinks);
      setFiltered('');
    }
  };

  useEffect(() => {
    const fetchIngredient = async () => {
      if (state?.ingredient) {
        const data = await getDrinkListByIngredient(state.ingredient);
        setDrinksList(data);
      }
    };
    fetchIngredient();
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
        {drinksCategoryList
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

      {drinksList.length > 0 && drinksList
        .filter((_e, index) => index < maxNumber)
        .map(({ strDrink, strDrinkThumb, idDrink }, index) => (
          <Link to={ `/drinks/${idDrink}` } key={ index }>
            <div data-testid={ `${index}-recipe-card` }>
              <p data-testid={ `${index}-card-name` }>{strDrink}</p>
              <img
                src={ strDrinkThumb }
                alt="recipe"
                data-testid={ `${index}-card-img` }
              />
            </div>
          </Link>
        ))}
    </main>
  );
}

export default DrinksResults;
