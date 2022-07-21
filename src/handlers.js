import _ from 'lodash';

const initiateState = (fieldParameters) => {
  const cells = [];
  for (let i = 1; i <= fieldParameters.rowsAmount; i += 1) {
    for (let k = 1; k <= fieldParameters.columnsAmount; k += 1) {
      const cell = {
        row: i,
        column: k,
        content: 'empty',
      };
      cells.push(cell);
    }
  }
  return cells;
};

const generateHeadPosition = (fieldParameters) => {
  const row = Math.floor(Math.random() * (fieldParameters.rowsAmount - 3) + 3);
  const column = Math.floor(Math.random() * (fieldParameters.columnsAmount - 3) + 3);
  return {
    row, column, currentDirection: 'up', nextDirection: 'up', previousDirection: '',
  };
};

const generateFoodPosition = (cells) => {
  const emptyCells = cells.filter((cell) => cell.content === 'empty');
  const randomIndex = Math.floor(Math.random() * emptyCells.length - 1);
  return emptyCells[randomIndex];
};

const findIndex = (position, cells) => _.findIndex(cells, {
  row: position.row, column: position.column,
});

export {
  initiateState, generateHeadPosition, generateFoodPosition, findIndex,
};
