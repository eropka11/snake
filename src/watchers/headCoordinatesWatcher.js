import onChange from 'on-change';
import snakeHead from '../images/snakeHead.png';
import snakeHeadRight from '../images/snakeHeadRight.png';
import snakeHeadDown from '../images/snakeHeadDown.png';
import snakeHeadLeft from '../images/snakeHeadLeft.png';

export default (state) => onChange(state, (path, value) => {
  const cellOfNewHead = document.querySelector(`[data-row="${value.nextHeadPosition.row}"] > [data-column="${value.nextHeadPosition.column}"]`);
  const newHead = document.createElement('img');
  switch (value.nextHeadPosition.currentDirection) {
    case 'up':
      newHead.src = snakeHead;
      break;
    case 'right':
      newHead.src = snakeHeadRight;
      break;
    case 'left':
      newHead.src = snakeHeadLeft;
      break;
    case 'down':
      newHead.src = snakeHeadDown;
      break;
    default:
      break;
  }
  newHead.classList.add('d-block');
  cellOfNewHead.lastChild.remove();
  cellOfNewHead.append(newHead);
});
