import onChange from 'on-change';
import blackField from '../images/emptyField.png';
import snakeTail from '../images/snakeTail.png';
import snakeTailRight from '../images/snakeTailRight.png';
import snakeTailLeft from '../images/snakeTailLeft.png';
import snakeTailDown from '../images/snakeTailDown.png';

export default (state) => onChange(state, (path, value) => {
  if (value.tail !== undefined) {
    const cellToClear = document.querySelector(`[data-row="${value.tail.row}"] > [data-column="${value.tail.column}"]`);
    const imageForEmptyCell = document.createElement('img');
    imageForEmptyCell.src = blackField;
    imageForEmptyCell.classList.add('d-block');
    cellToClear.lastChild.remove();
    cellToClear.append(imageForEmptyCell);
  }
  const newTailPosition = document.querySelector(`[data-row="${value.nextTailPosition.row}"] > [data-column="${value.nextTailPosition.column}"]`);
  const tailImage = document.createElement('img');
  switch (value.nextTailPosition.nextDirection) {
    case 'up':
      tailImage.src = snakeTail;
      break;
    case 'right':
      tailImage.src = snakeTailRight;
      break;
    case 'left':
      tailImage.src = snakeTailLeft;
      break;
    case 'down':
      tailImage.src = snakeTailDown;
      break;
    default:
      break;
  }
  tailImage.classList.add('d-block');
  newTailPosition.lastChild.remove();
  newTailPosition.append(tailImage);
});
