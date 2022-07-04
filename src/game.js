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
    currentMovementDirection: 'up',
    newMovementDirection: '',
    newHeadPosition: '',
    isGameOver: false,
    bodyCoordinates: [],
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
        watchedState.field.cells.push(cell);
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

  const findIndex = (position) => _.findIndex(state.field.cells, {
    row: position.row, column: position.column,
  });

  const fieldUpdater = (nextIndex, content, nextCoordinate, currentCoordinate, newDirection) => {
    watchedState.coordinatesToUpdate = {
      nextCoordinate, content, currentCoordinate, newDirection,
    };
    if (content === 'addBody' || content === 'tail') {
      watchedState.field.cells[nextIndex].content = 'body';
    } else {
      watchedState.field.cells[nextIndex].content = content;
    }
  };

  let movingTimeout;

  const moveUp = (head) => {
    const nextHeadPosition = { row: head.row - 1, column: head.column };
    const nextHeadIndex = findIndex(nextHeadPosition);
    if (head.row < 2 || state.field.cells[nextHeadIndex].content === 'body') {
      watchedState.isGameOver = true;
      return;
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      watchedState.bodyCoordinates.unshift(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head, 'up');
      if (state.bodyCoordinates.length > 1) {
        const tailToDelete = _.last(state.bodyCoordinates);
        fieldUpdater(headIndex, 'body', head);
        fieldUpdater(headIndex, 'tail', head, tailToDelete);
        const tailIndex = findIndex(tailToDelete);
        watchedState.field.cells[tailIndex].content = 'empty';
      } else {
        watchedState.field.cells[headIndex].content = 'empty';
      }
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'up';
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(moveUp, 1000, nextHeadPosition);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head, 'up');
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextFoodIndex, 'food', nextFoodPosition);
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'up';
      watchedState.bodyCoordinates.unshift(head);
      movingTimeout = window.setTimeout(moveUp, 1000, nextHeadPosition);
    }
  };

  const moveDown = (head) => {
    const nextHeadPosition = { row: head.row + 1, column: head.column };
    const nextHeadIndex = findIndex(nextHeadPosition);
    if (head.row === state.field.difficulty || state.field.cells[nextHeadIndex].content === 'body') {
      watchedState.isGameOver = true;
      return;
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      watchedState.bodyCoordinates.unshift(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head, 'down');
      if (state.bodyCoordinates.length > 1) {
        const tailToDelete = _.last(state.bodyCoordinates);
        fieldUpdater(headIndex, 'body', head);
        fieldUpdater(headIndex, 'tail', head, tailToDelete);
        const tailIndex = findIndex(tailToDelete);
        watchedState.field.cells[tailIndex].content = 'empty';
      } else {
        watchedState.field.cells[headIndex].content = 'empty';
      }
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'down';
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(moveDown, 1000, nextHeadPosition);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head, 'down');
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextFoodIndex, 'food', nextFoodPosition);
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'down';
      watchedState.bodyCoordinates.unshift(head);
      movingTimeout = window.setTimeout(moveDown, 1000, nextHeadPosition);
    }
  };

  const moveLeft = (head) => {
    const nextHeadPosition = { row: head.row, column: head.column - 1 };
    const nextHeadIndex = findIndex(nextHeadPosition);
    if (head.column < 2 || state.field.cells[nextHeadIndex].content === 'body') {
      watchedState.isGameOver = true;
      return;
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      watchedState.bodyCoordinates.unshift(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head, 'left');
      if (state.bodyCoordinates.length > 1) {
        const tailToDelete = _.last(state.bodyCoordinates);
        fieldUpdater(headIndex, 'body', head);
        fieldUpdater(headIndex, 'tail', head, tailToDelete);
        const tailIndex = findIndex(tailToDelete);
        watchedState.field.cells[tailIndex].content = 'empty';
      } else {
        watchedState.field.cells[headIndex].content = 'empty';
      }
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'left';
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(moveLeft, 1000, nextHeadPosition);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head, 'left');
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextFoodIndex, 'food', nextFoodPosition);
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'left';
      watchedState.bodyCoordinates.unshift(head);
      movingTimeout = window.setTimeout(moveLeft, 1000, nextHeadPosition);
    }
  };

  const moveRight = (head) => {
    const nextHeadPosition = { row: head.row, column: head.column + 1 };
    const nextHeadIndex = findIndex(nextHeadPosition);
    if (head.column === state.field.difficulty || state.field.cells[nextHeadIndex].content === 'body') {
      watchedState.isGameOver = true;
      return;
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      watchedState.bodyCoordinates.unshift(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head, 'right');
      if (state.bodyCoordinates.length > 1) {
        const tailToDelete = _.last(state.bodyCoordinates);
        fieldUpdater(headIndex, 'body', head);
        fieldUpdater(headIndex, 'tail', head, tailToDelete);
        const tailIndex = findIndex(tailToDelete);
        watchedState.field.cells[tailIndex].content = 'empty';
      } else {
        watchedState.field.cells[headIndex].content = 'empty';
      }
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'right';
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(moveRight, 1000, nextHeadPosition);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head, 'right');
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextFoodIndex, 'food', nextFoodPosition);
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'right';
      watchedState.bodyCoordinates.unshift(head);
      movingTimeout = window.setTimeout(moveRight, 1000, nextHeadPosition);
    }
  };

  const startForm = document.querySelector('form');
  startForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const startFormData = new FormData(startForm);
    const difficulty = Number(startFormData.get('difficulty'));
    watchedState.field.difficulty = difficulty;

    initiateState(difficulty);
    const headPosition = generateHeadPosition(difficulty);
    watchedState.newHeadPosition = headPosition;
    const foodPosition = generateFoodPosition();

    const nextHeadIndex = findIndex(state.newHeadPosition);
    fieldUpdater(nextHeadIndex, 'head', state.newHeadPosition, null, 'up');

    const nextFoodIndex = findIndex(foodPosition);
    fieldUpdater(nextFoodIndex, 'food', foodPosition);

    moveUp(state.newHeadPosition);

    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyS':
        case 'ArrowDown':
          if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
            window.clearTimeout(movingTimeout);
            movingTimeout = window.setTimeout(moveDown, 500, state.newHeadPosition);
          }
          break;
        case 'KeyW':
        case 'ArrowUp':
          if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
            window.clearTimeout(movingTimeout);
            movingTimeout = window.setTimeout(moveUp, 500, state.newHeadPosition);
          }
          break;
        case 'KeyA':
        case 'ArrowLeft':
          if (state.currentMovementDirection !== 'right' && state.currentMovementDirection !== 'left') {
            window.clearTimeout(movingTimeout);
            movingTimeout = window.setTimeout(moveLeft, 500, state.newHeadPosition);
          }
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (state.currentMovementDirection !== 'right' && state.currentMovementDirection !== 'left') {
            window.clearTimeout(movingTimeout);
            movingTimeout = window.setTimeout(moveRight, 500, state.newHeadPosition);
          }
          break;
        default:
      }
    });
  });
};
