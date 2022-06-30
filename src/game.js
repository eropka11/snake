import _ from 'lodash';
import watcher from './watcher.js';

export default () => {
  const state = {
    field: {
      difficulty: '',
      cells: [],
    },
    coordinatesToUpdate: '',
    currentMovement: 'up',
    currentHeadPosition: '',
  };

  const watchedState = watcher(state);
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
    const nextHeadPosition = { row: head.row - 1, column: head.column };
    const nextHeadIndex = findNextIndex(nextHeadPosition);
    if (head.row < 2) {
      return;
    }
    sendCellUpdateToWatcher(nextHeadIndex, 'head', nextHeadPosition, head);
    watchedState.currentHeadPosition = nextHeadPosition;
    watchedState.currentMovement = 'up';
    const moveUpTimeout = window.setTimeout(moveUp, 1000, nextHeadPosition);
    window.addEventListener('keydown', (e) => {
      const moveStoppers = ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'];
      if (moveStoppers.includes(e.code)) {
        window.clearTimeout(moveUpTimeout);
      }
    });
  };

  const moveDown = (head) => {
    const nextHeadPosition = { row: head.row + 1, column: head.column };
    const nextHeadIndex = findNextIndex(nextHeadPosition);
    if (head.row === state.field.difficulty) {
      return;
    }
    sendCellUpdateToWatcher(nextHeadIndex, 'head', nextHeadPosition, head);
    watchedState.currentHeadPosition = nextHeadPosition;
    watchedState.currentMovement = 'down';
    const moveDownTimeout = window.setTimeout(moveDown, 1000, nextHeadPosition);
    window.addEventListener('keydown', (e) => {
      const moveStoppers = ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'];
      if (moveStoppers.includes(e.code)) {
        window.clearTimeout(moveDownTimeout);
      }
    });
  };

  const moveLeft = (head) => {
    const nextHeadPosition = { row: head.row, column: head.column - 1 };
    const nextHeadIndex = findNextIndex(nextHeadPosition);
    if (head.column < 2) {
      return;
    }
    sendCellUpdateToWatcher(nextHeadIndex, 'head', nextHeadPosition, head);
    watchedState.currentHeadPosition = nextHeadPosition;
    watchedState.currentMovement = 'left';
    const moveLeftTimeout = window.setTimeout(moveLeft, 1000, nextHeadPosition);
    window.addEventListener('keydown', (e) => {
      const moveStoppers = ['ArrowUp', 'ArrowDown', 'KeyS', 'KeyW'];
      if (moveStoppers.includes(e.code)) {
        window.clearTimeout(moveLeftTimeout);
      }
    });
  };

  const moveRight = (head) => {
    const nextHeadPosition = { row: head.row, column: head.column + 1 };
    const nextHeadIndex = findNextIndex(nextHeadPosition);
    if (head.column === state.field.difficulty) {
      return;
    }
    sendCellUpdateToWatcher(nextHeadIndex, 'head', nextHeadPosition, head);
    watchedState.currentHeadPosition = nextHeadPosition;
    watchedState.currentMovement = 'right';
    const moveRightTimeout = window.setTimeout(moveRight, 1000, nextHeadPosition);
    window.addEventListener('keydown', (e) => {
      const moveStoppers = ['ArrowUp', 'ArrowDown', 'KeyS', 'KeyW'];
      if (moveStoppers.includes(e.code)) {
        window.clearTimeout(moveRightTimeout);
      }
    });
  };

  const startForm = document.querySelector('form');
  startForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const startFormData = new FormData(startForm);
    const difficulty = Number(startFormData.get('difficulty'));
    watchedState.field.difficulty = difficulty;

    initiateState(difficulty);
    const headPosition = generateHeadPosition(difficulty);
    watchedState.currentHeadPosition = headPosition;
    const foodPosition = generateFoodPosition();

    const nextHeadIndex = findNextIndex(state.currentHeadPosition);
    sendCellUpdateToWatcher(nextHeadIndex, 'head', state.currentHeadPosition);

    const nextFoodIndex = findNextIndex(foodPosition);
    sendCellUpdateToWatcher(nextFoodIndex, 'food', foodPosition);

    window.setTimeout(moveUp, 1000, state.currentHeadPosition);
    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyS':
        case 'ArrowDown':
          if (state.currentMovement !== 'up') {
            window.setTimeout(moveDown, 500, state.currentHeadPosition);
          }
          break;
        case 'KeyW':
        case 'ArrowUp':
          if (state.currentMovement !== 'down') {
            window.setTimeout(moveUp, 500, state.currentHeadPosition);
          }
          break;
        case 'KeyA':
        case 'ArrowLeft':
          if (state.currentMovement !== 'right') {
            window.setTimeout(moveLeft, 500, state.currentHeadPosition);
          }
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (state.currentMovement !== 'left') {
            window.setTimeout(moveRight, 500, state.currentHeadPosition);
          }
          break;
        default:
      }
    });
  });
};
