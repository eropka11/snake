import _ from 'lodash';
import onChange from 'on-change';
import render from './render.js';

export default () => {
  const state = {
    field: {
      difficulty: '',
      cells: [],
    },
    coordinatesToUpdate: '',
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value);
  });

  const initiateState = (squareSideLength) => {
    for (let i = 1; i <= squareSideLength; i += 1) {
      for (let k = 1; k <= squareSideLength; k += 1) {
        const cell = {
          row: i,
          column: k,
          content: 'empty',
        };
        state.field.cells.push(cell);
      }
    }
  };

  const generateHeadPosition = (sideLength) => {
    const row = Math.floor(Math.random() * (sideLength - 3) + 3);
    const column = Math.floor(Math.random() * (sideLength - 3) + 3);
    return { row, column };
  };

  const generateFoodPosition = () => {
    const emptyCells = state.field.cells.filter((cell) => cell.content === 'empty');
    const randomIndex = Math.floor(Math.random() * emptyCells.length - 1);
    return emptyCells[randomIndex];
  };

  const findNextIndex = (nextPosition) => _.findIndex(state.field.cells, {
    row: nextPosition.row, column: nextPosition.column,
  });

  const sendCellUpdateToWatcher = (nextIndex, content, nextCoordinate, currentCoordinate) => {
    watchedState.coordinatesToUpdate = { nextCoordinate, content, currentCoordinate };
    watchedState.field.cells[nextIndex].content = content;
  };

  const moveUp = (head) => {
    console.log(1);
    const nextHeadPosition = { row: head.row - 1, column: head.column };
    const nextHeadIndex = findNextIndex(nextHeadPosition);
    window.setInterval(sendCellUpdateToWatcher, state.field.difficulty * 100, nextHeadIndex, 'head', nextHeadPosition, head);
  };

  const startForm = document.querySelector('form');
  startForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const startFormData = new FormData(startForm);
    const difficulty = Number(startFormData.get('difficulty'));
    watchedState.field.difficulty = difficulty;

    initiateState(difficulty);
    const headPosition = generateHeadPosition(difficulty);
    const foodPosition = generateFoodPosition();

    const nextHeadIndex = findNextIndex(headPosition);
    sendCellUpdateToWatcher(nextHeadIndex, 'head', headPosition);

    const nextFoodIndex = findNextIndex(foodPosition);
    sendCellUpdateToWatcher(nextFoodIndex, 'food', foodPosition);

    window.setTimeout(moveUp, 1000, headPosition);
  });
};
