import generateField from './generateField.js';
import snakeHead from './images/snakeHead.png';
import food from './images/food.png';
import blackField from './images/emptyField.png';
import snakeBody from './images/snakeBody.png';
import loseMessage from './images/loseMessage.jpg';
import snakeTail from './images/snakeTail.png';

export default (path, value) => {
  const body = document.querySelector('body');
  if (path === 'field.difficulty') {
    body.textContent = '';
    body.append(generateField(value));
  }
  if (path === 'coordinatesToUpdate') {
    if (value.content === 'head') {
      const cellOfNewHead = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
      const newHead = document.createElement('img');
      newHead.src = snakeHead;
      newHead.id = value.nextCoordinate.currentDirection;
      if (newHead.classList.contains(value.nextCoordinate.previousDirection)) {
        newHead.classList.remove(value.nextCoordinate.previousDirection);
      }
      newHead.classList.add('d-block', value.nextCoordinate.currentDirection);
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
    if (value.content === 'addBody') {
      const cellOfNewBody = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
      const newBody = document.createElement('img');
      newBody.src = snakeBody;
      newBody.classList.add('d-block');
      cellOfNewBody.lastChild.remove();
      cellOfNewBody.append(newBody);
    }
    if (value.content === 'body') {
      if (value.nextCoordinate !== undefined) {
        const newBodyPosition = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
        const bodyImage = document.createElement('img');
        bodyImage.src = snakeBody;
        bodyImage.classList.add('d-block');
        newBodyPosition.lastChild.remove();
        newBodyPosition.append(bodyImage);
      }
    }
    if (value.content === 'tail') {
      if (value.currentCoordinate !== null) {
        const cellToClear = document.querySelector(`[data-row="${value.currentCoordinate.row}"] > [data-column="${value.currentCoordinate.column}"]`);
        const imageForEmptyCell = document.createElement('img');
        imageForEmptyCell.src = blackField;
        imageForEmptyCell.classList.add('d-block');
        cellToClear.lastChild.remove();
        cellToClear.append(imageForEmptyCell);
      }
      const newTailPosition = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
      const tailImage = document.createElement('img');
      tailImage.src = snakeTail;
      if (tailImage.classList.contains(value.nextCoordinate.previousDirection)) {
        tailImage.classList.remove(value.nextCoordinate.previousDirection);
      }
      tailImage.classList.add('d-block', value.nextCoordinate.nextDirection);
      newTailPosition.lastChild.remove();
      newTailPosition.append(tailImage);
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
