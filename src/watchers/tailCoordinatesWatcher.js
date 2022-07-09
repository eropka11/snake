import onChange from 'on-change';
import blackField from '../images/emptyField.png';
import snakeTail from '../images/snakeTail.png';

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
  tailImage.src = snakeTail;
  if (tailImage.classList.contains(value.nextTailPosition.previousDirection)) {
    tailImage.classList.remove(value.nextTailPosition.previousDirection);
  }
  tailImage.classList.add('d-block', value.nextTailPosition.nextDirection);
  newTailPosition.lastChild.remove();
  newTailPosition.append(tailImage);
});
