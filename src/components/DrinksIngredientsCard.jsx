import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function DrinksIngredientsCard() {
  const [ingredientDrink, setIngredientDrink] = useState('');
  const { push } = useHistory();

  async function fetchingredientDrink() {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
    const data = await response.json();
    return setIngredientDrink(data.drinks);
  }

  function redirect(ingredient) {
    push({
      pathname: '/drinks',
      state: { ingredient },
    });
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
          // <Link key={ index } to="/drinks">
          <div
            key={ index }
            onClick={ () => redirect(item.strIngredient1) }
            role="presentation"
          >
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
          </div>
          // </Link>
        ))}
    </div>
  );
}

export default DrinksIngredientsCard;
