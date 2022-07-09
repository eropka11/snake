import onChange from 'on-change';
import food from '../images/food.png';

export default (state) => onChange(state, (path, value) => {
  const cellOfNewFood = document.querySelector(`[data-row="${value.nextFoodPosition.row}"] > [data-column="${value.nextFoodPosition.column}"]`);
  const newFood = document.createElement('img');
  newFood.src = food;
  newFood.classList.add('d-block');
  cellOfNewFood.lastChild.remove();
  cellOfNewFood.append(newFood);
});
