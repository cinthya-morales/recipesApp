import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

function ResultsList({ data, index }) {
  const { strMeal, strMealThumb, idMeal } = data;
  return (
    <Link to={ `/foods/${idMeal}` } key={ index }>
      <div data-testid={ `${index}-recipe-card` }>
        <p data-testid={ `${index}-card-name` }>{strMeal}</p>
        <img
          src={ strMealThumb }
          alt="recipe"
          data-testid={ `${index}-card-img` }
        />
      </div>
    </Link>);
}

ResultsList.propTypes = {
  data: PropTypes.shape({
    idMeal: PropTypes.string,
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
  }).isRequired,
  index: PropTypes.string.isRequired,
};

export default ResultsList;
