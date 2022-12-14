import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import usePath from '../hooks/usePath';
import DetailsContext from '../context/detailsContext';
import YoutubeEmbed from '../components/YoutubeEmbed';
import { getDrinksRecipes, getFoodRecipes } from '../services/fetchAPI';
import RecomendationCard from '../components/RecomendationCard';
import useLocalStorage from '../hooks/useLocalStorage';
import FavoriteButton from '../components/FavoriteButton';
import ShareButton from '../components/ShareButton';
import './FoodsDetails.css';

function FoodDetails() {
  const inProgressDefaultValue = {
    cocktails: {},
    meals: {},
  };

  const [doneRecipes] = useLocalStorage('doneRecipes', []);
  const [inProgressRecipes] = useLocalStorage(
    'inProgressRecipes', inProgressDefaultValue,
  );

  const { name, strName, strNameThumb, strCategory,
    strNameI, strNameThumbI, strCategoryI, literalName,
    inProgressName } = usePath();

  const { id } = useParams();
  const { push } = useHistory();

  const { setFoodId,
    foodDetails,
    foodIngredients,
    setName } = useContext(DetailsContext);

  const [recomendations, setRecomendations] = useState([]);
  const [buttonText, setButtonText] = useState('');
  const [isRecipeDone, setIsRecipeDone] = useState(false);
  // const [isRecipeInProgress, setIsRecipeInProgress] = useState(false);

  useEffect(() => {
    if (inProgressRecipes[inProgressName][id]) {
      setButtonText('Continue Recipe');
      // setIsRecipeInProgress(true);
    } else {
      setButtonText('Start Recipe');
      // setIsRecipeInProgress(false);
    }
  }, [id, inProgressName, inProgressRecipes]);

  useEffect(() => {
    const checkIfDone = doneRecipes.some(({ id: recipeId }) => recipeId === id);
    setIsRecipeDone(checkIfDone);
  }, [doneRecipes, id]);

  useEffect(() => {
    setName(name);
  }, [name, setName]);

  useEffect(() => {
    setFoodId(id);
  }, [setFoodId, id]);

  useEffect(() => {
    const fetchRecomendations = async () => {
      const MAX_NUMBER = 6;
      const data = name === 'meals' ? await getDrinksRecipes() : await getFoodRecipes();
      const filteredRecomendations = data.filter((_e, index) => index < MAX_NUMBER);
      setRecomendations(filteredRecomendations);
    };
    fetchRecomendations();
  }, [name]);

  const goToInProgress = () => {
    // if (!isRecipeInProgress) {
    //   const ingredientsArray = foodIngredients
    //     .map(({ ingredient, measure }) => (
    //       { done: false, ingredient: `${ingredient}${measure}` }
    //     ));

    //   setInProgressRecipes((prevState) => (
    //     {
    //       ...prevState,
    //       [inProgressName]:
    //         { ...prevState[inProgressName], [id]: ingredientsArray },
    //     }
    //   ));
    // }

    push(`/${literalName}/${id}/in-progress`);
  };

  if (!foodDetails[strName]) return <h2>Carregando...</h2>;

  return (
    <div>
      <img
        className="recipe-photo"
        data-testid="recipe-photo"
        src={ foodDetails[strNameThumb] }
        alt={ foodDetails[strName] }
      />
      <h2 data-testid="recipe-title">{foodDetails[strName]}</h2>

      <ShareButton />
      <FavoriteButton />

      <h2 data-testid="recipe-category">{foodDetails[strCategory]}</h2>

      <h2>Ingredients</h2>
      <ul>
        {foodIngredients.map(({ ingredient, measure }, index) => (
          <li
            data-testid={ `${index}-ingredient-name-and-measure` }
            key={ index }
          >
            {ingredient}
            {measure}
          </li>
        ))}
      </ul>

      <h2>Instructions</h2>
      <p data-testid="instructions">{foodDetails.strInstructions}</p>

      {name === 'meals' && (
        <div>
          <h2>Video</h2>
          <YoutubeEmbed embedId={ foodDetails.strYoutube.split('=')[1] } />
        </div>
      )}

      <h3>Receitas recomendadas</h3>
      <section className="carousel">
        {recomendations.map((rec, index) => (
          <RecomendationCard
            key={ index }
            imgSrc={ rec[strNameThumbI] }
            category={ rec[strCategoryI] }
            name={ rec[strNameI] }
            index={ index }
          />
        ))}
      </section>

      {!isRecipeDone && (
        <Button
          size="lg"
          className="start-recipe-btn"
          data-testid="start-recipe-btn"
          type="button"
          onClick={ goToInProgress }
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}

export default FoodDetails;
