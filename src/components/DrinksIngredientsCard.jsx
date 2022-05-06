import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function DrinksIngredientsCard() {
  const [ingredientDrink, setIngredientDrink] = useState('');

  async function fetchingredientDrink() {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
    const data = await response.json();
    return setIngredientDrink(data.drinks);
  }

  useEffect(() => {
    fetchingredientDrink();
  }, []);

  const MAX_INGREDIENT = 12;

  return (
    <div>
      {ingredientDrink.length !== 0
      && ingredientDrink
        .slice(0, MAX_INGREDIENT)
        .map((item, index) => (
          <Link key={ index } to="/drinks">
            <button
              type="button"
              data-testid={ `${index}-ingredient-card` }
              value={ item.strIngredient1 }
            >
              <h3 data-testid={ `${index}-card-name` }>{item.strIngredient1}</h3>
              <img
                data-testid={ `${index}-card-img` }
                src={
                  `https://www.thecocktaildb.com/images/ingredients/${item.strIngredient1}-Small.png`
                }
                alt={ item.strIngredient1 }
              />
            </button>
          </Link>
        ))}
    </div>
  );
}

export default DrinksIngredientsCard;
