import generateField from './generateField.js';
import snakeHead from './images/snakeHead.png';
import food from './images/food.png';
import blackField from './images/emptyField.png';

export default (path, value) => {
  if (path === 'field.difficulty') {
    const body = document.querySelector('body');
    body.textContent = '';
    body.append(generateField(value));
  }
  if (path === 'coordinatesToUpdate') {
    if (value.content === 'head') {
      if (value.currentCoordinate !== undefined) {
        const cellOfCurrentHead = document.querySelector(`[data-row="${value.currentCoordinate.row}"] > [data-column="${value.currentCoordinate.column}"]`);
        const currentHead = document.createElement('img');
        currentHead.src = blackField;
        currentHead.classList.add('d-block');
        cellOfCurrentHead.lastChild.remove();
        cellOfCurrentHead.append(currentHead);
      }

      const cellOfNewHead = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
      const newHead = document.createElement('img');
      newHead.src = snakeHead;
      newHead.classList.add('d-block');
      cellOfNewHead.lastChild.remove();
      cellOfNewHead.append(newHead);
    }
    if (value.content === 'food') {
      const cellOfNewFood = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
      const newFood = document.createElement('img');
      newFood.src = food;
      newFood.classList.add('d-block');
      cellOfNewFood.lastChild.remove();
      cellOfNewFood.append(newFood);
    }
  }
  return 1;
};
