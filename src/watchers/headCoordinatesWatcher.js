import onChange from 'on-change';
import snakeHead from '../images/snakeHead.png';

export default (state) => onChange(state, (path, value) => {
  const cellOfNewHead = document.querySelector(`[data-row="${value.nextHeadPosition.row}"] > [data-column="${value.nextHeadPosition.column}"]`);
  const newHead = document.createElement('img');
  newHead.src = snakeHead;
  newHead.id = value.nextHeadPosition.currentDirection;
  if (newHead.classList.contains(value.nextHeadPosition.previousDirection)) {
    newHead.classList.remove(value.nextHeadPosition.previousDirection);
  }
  newHead.classList.add('d-block', value.nextHeadPosition.currentDirection);
  cellOfNewHead.lastChild.remove();
  cellOfNewHead.append(newHead);
});
