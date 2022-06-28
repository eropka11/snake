import blackField from './images/emptyField.png';

export default (squareSideLength) => {
  const gameField = document.createElement('div');
  gameField.classList.add('gameField');

  for (let i = 1; i <= squareSideLength; i += 1) {
    const row = document.createElement('div');
    row.classList.add(`row-${squareSideLength}`);
    gameField.append(row);

    for (let k = 1; k <= squareSideLength; k += 1) {
      const emptyField = document.createElement('img');
      emptyField.src = blackField;
      emptyField.classList.add('d-block');
      const cell = document.createElement('div');
      cell.classList.add(`cell-${squareSideLength}`, 'd-inline-block');
      cell.id = `r${i}c${k}`;
      cell.append(emptyField);
      row.append(cell);
    }
  }

  const gameZone = document.createElement('div');
  gameZone.classList.add('d-flex', 'justify-content-center');
  gameZone.append(gameField);
  return gameZone;
};
