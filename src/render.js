import generateField from './generateField.js';
import snakeHead from './images/snakeHead.png';
import food from './images/food.png';
import blackField from './images/emptyField.png';
import snakeBody from './images/snakeBody.png';
import snakeTail from './images/snakeTail.png';
import snakeBodyTurned from './images/snakeBodyTurned.png';
import showSettings from './showSettings.js';

export default (path, value) => {
  const body = document.querySelector('body');
  const languageSelectDiv = document.querySelector('div');
  if (path === 'language') {
    languageSelectDiv.remove();
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    body.append(showSettings(value), errorDiv);
  }
  if (path === 'error') {
    const errorDiv = document.querySelector('.error');
    const errorHeader = document.createElement('h4');
    if (errorDiv.lastChild !== null) {
      errorDiv.lastChild.remove();
    }
    errorHeader.textContent = value;
    errorDiv.append(errorHeader);
  }
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
      const newBodyPosition = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
      const bodyImage = document.createElement('img');
      bodyImage.src = snakeBody;
      if (value.nextCoordinate.nextDirection === value.nextCoordinate.currentDirection) {
        bodyImage.src = snakeBody;
        bodyImage.classList.add('d-block');
      } else {
        switch (value.nextCoordinate.currentDirection) {
          case 'up':
            if (value.nextCoordinate.nextDirection === 'left') {
              bodyImage.src = snakeBodyTurned;
              bodyImage.classList.add('d-block', 'downLeft');
            } else {
              bodyImage.src = snakeBodyTurned;
              bodyImage.classList.add('d-block', 'downRight');
            }
            break;
          case 'down':
            if (value.nextCoordinate.nextDirection === 'left') {
              bodyImage.src = snakeBodyTurned;
              bodyImage.classList.add('d-block', 'upLeft');
            } else {
              bodyImage.src = snakeBodyTurned;
              bodyImage.classList.add('d-block', 'upRight');
            }
            break;
          case 'left':
            if (value.nextCoordinate.nextDirection === 'down') {
              bodyImage.src = snakeBodyTurned;
              bodyImage.classList.add('d-block', 'downRight');
            } else {
              bodyImage.src = snakeBodyTurned;
              bodyImage.classList.add('d-block', 'upRight');
            }
            break;
          case 'right':
            if (value.nextCoordinate.nextDirection === 'down') {
              bodyImage.src = snakeBodyTurned;
              bodyImage.classList.add('d-block', 'downLeft');
            } else {
              bodyImage.src = snakeBodyTurned;
              bodyImage.classList.add('d-block', 'upLeft');
            }
            break;
          default:
        }
      }
      newBodyPosition.lastChild.remove();
      newBodyPosition.append(bodyImage);
    }
    if (value.content === 'body') {
      if (value.nextCoordinate !== undefined) {
        const newBodyPosition = document.querySelector(`[data-row="${value.nextCoordinate.row}"] > [data-column="${value.nextCoordinate.column}"]`);
        const bodyImage = document.createElement('img');
        if (value.nextCoordinate.nextDirection === value.nextCoordinate.currentDirection) {
          bodyImage.src = snakeBody;
          bodyImage.classList.add('d-block');
        } else {
          switch (value.nextCoordinate.currentDirection) {
            case 'up':
              if (value.nextCoordinate.nextDirection === 'left') {
                bodyImage.src = snakeBodyTurned;
                bodyImage.classList.add('d-block', 'downLeft');
              } else {
                bodyImage.src = snakeBodyTurned;
                bodyImage.classList.add('d-block', 'downRight');
              }
              break;
            case 'down':
              if (value.nextCoordinate.nextDirection === 'left') {
                bodyImage.src = snakeBodyTurned;
                bodyImage.classList.add('d-block', 'upLeft');
              } else {
                bodyImage.src = snakeBodyTurned;
                bodyImage.classList.add('d-block', 'upRight');
              }
              break;
            case 'left':
              if (value.nextCoordinate.nextDirection === 'down') {
                bodyImage.src = snakeBodyTurned;
                bodyImage.classList.add('d-block', 'downRight');
              } else {
                bodyImage.src = snakeBodyTurned;
                bodyImage.classList.add('d-block', 'upRight');
              }
              break;
            case 'right':
              if (value.nextCoordinate.nextDirection === 'down') {
                bodyImage.src = snakeBodyTurned;
                bodyImage.classList.add('d-block', 'downLeft');
              } else {
                bodyImage.src = snakeBodyTurned;
                bodyImage.classList.add('d-block', 'upLeft');
              }
              break;
            default:
          }
        }
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
  if (path === 'finalScore') {
    const endGameMessege = document.createElement('div');
    const endGameHeader = document.createElement('h1');
    endGameHeader.textContent = `Твой счёт: ${value}`;
    endGameMessege.append(endGameHeader);
    body.textContent = '';
    body.append(endGameMessege);
  }
  return 1;
};
