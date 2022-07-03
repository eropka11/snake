import generateField from './generateField.js';
import snakeHead from './images/snakeHead.png';
import food from './images/food.png';
import blackField from './images/emptyField.png';
import snakeBody from './images/snakeBody.png';
import loseMessage from './images/loseMessage.jpg';

export default (path, value) => {
  const body = document.querySelector('body');
  if (path === 'field.difficulty') {
    body.textContent = '';
    body.append(generateField(value));
  }
  if (path === 'coordinatesToUpdate') {
    if (value.content === 'head') {
      if (value.currentCoordinate !== null) {
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
      newHead.id = value.newDirection;
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
    if (value.content === 'body') {
      const cellOfNewBody = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
      const newBody = document.createElement('img');
      newBody.src = snakeBody;
      newBody.classList.add('d-block', 'body');
      cellOfNewBody.lastChild.remove();
      cellOfNewBody.append(newBody);
      setTimeout(1000);
      console.log(cellOfNewBody, cellOfNewBody.lastChild);
    }
  }
  if (path === 'isGameOver') {
    const youDeadMessage = document.createElement('img');
    youDeadMessage.src = loseMessage;
    body.textContent = '';
    body.append(youDeadMessage);
  }
  return 1;
};
