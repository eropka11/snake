import onChange from 'on-change';
import blackField from '../images/emptyField.png';

const generateField = (fieldParameters) => {
  const gameField = document.createElement('div');
  gameField.classList.add('gameField');

  for (let i = 1; i <= fieldParameters.rowsAmount; i += 1) {
    const row = document.createElement('div');
    row.dataset.row = i;
    row.classList.add(`row-${fieldParameters.minValue}`);
    gameField.append(row);

    for (let k = 1; k <= fieldParameters.columnsAmount; k += 1) {
      const emptyField = document.createElement('img');
      emptyField.src = blackField;
      emptyField.classList.add('d-block');
      const cell = document.createElement('div');
      cell.classList.add(`cell-${fieldParameters.minValue}`, 'd-inline-block');
      cell.dataset.row = i;
      cell.dataset.column = k;
      cell.append(emptyField);
      row.append(cell);
    }
  }
  const gameZone = document.createElement('div');
  gameZone.classList.add('d-flex', 'justify-content-center', 'game-zone');
  gameField.classList.add('border', 'border-success');
  gameZone.append(gameField);
  return gameZone;
};

export default (state) => onChange(state, (path, value) => {
  const body = document.querySelector('body');
  body.textContent = '';
  const gameZone = generateField(value);
  body.append(gameZone);
  window.scrollTo(0, document.body.scrollHeight);
});
