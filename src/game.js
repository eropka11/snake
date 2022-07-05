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
    tailPosition: '',
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
    return {
      row, column, currentDirection: 'up', nextDirection: 'up', previousDirection: '',
    };
  };

  const generateFoodPosition = () => {
    const emptyCells = state.field.cells.filter((cell) => cell.content === 'empty');
    const randomIndex = Math.floor(Math.random() * emptyCells.length - 1);
    return emptyCells[randomIndex];
  };

  const findIndex = (position) => _.findIndex(state.field.cells, {
    row: position.row, column: position.column,
  });

  const fieldUpdater = (nextIndex, content, nextCoordinate, currentCoordinate) => {
    watchedState.coordinatesToUpdate = {
      nextCoordinate, content, currentCoordinate,
    };
    if (content === 'addBody') {
      watchedState.field.cells[nextIndex].content = 'body';
    } else {
      watchedState.field.cells[nextIndex].content = content;
    }
  };

  let movingTimeout;

  const moveUp = (head) => {
    const nextHeadPosition = {
      row: head.row - 1,
      column: head.column,
      currentDirection: head.nextDirection,
      nextDirection: head.nextDirection,
      previousDirection: head.currentDirection,
    };
    const tail = state.tailPosition;
    const nextHeadIndex = findIndex(nextHeadPosition);
    if (head.row < 2 || state.field.cells[nextHeadIndex].content === 'body') {
      watchedState.isGameOver = true;
      return;
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      watchedState.bodyCoordinates.unshift(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
      const newTailPosition = _.last(state.bodyCoordinates);
      fieldUpdater(headIndex, 'tail', newTailPosition, tail);
      const tailIndex = findIndex(tail);
      watchedState.field.cells[tailIndex].content = 'empty';
      if (state.bodyCoordinates.length > 1) {
        fieldUpdater(headIndex, 'body', head);
      } else {
        watchedState.field.cells[headIndex].content = 'empty';
      }
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.tailPosition = newTailPosition;
      watchedState.currentMovementDirection = 'up';
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(moveUp, 1000, nextHeadPosition);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
      fieldUpdater(nextFoodIndex, 'food', nextFoodPosition);
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'up';
      watchedState.bodyCoordinates.unshift(head);
      movingTimeout = window.setTimeout(moveUp, 1000, nextHeadPosition);
    }
  };

  const moveDown = (head) => {
    const nextHeadPosition = {
      row: head.row + 1,
      column: head.column,
      currentDirection: head.nextDirection,
      nextDirection: head.nextDirection,
    };
    const tail = state.tailPosition;
    const nextHeadIndex = findIndex(nextHeadPosition);
    if (head.row === state.field.difficulty || state.field.cells[nextHeadIndex].content === 'body') {
      watchedState.isGameOver = true;
      return;
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      watchedState.bodyCoordinates.unshift(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
      const newTailPosition = _.last(state.bodyCoordinates);
      fieldUpdater(headIndex, 'tail', newTailPosition, tail);
      const tailIndex = findIndex(tail);
      watchedState.field.cells[tailIndex].content = 'empty';
      if (state.bodyCoordinates.length > 1) {
        fieldUpdater(headIndex, 'body', head);
      } else {
        watchedState.field.cells[headIndex].content = 'empty';
      }
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.tailPosition = newTailPosition;
      watchedState.currentMovementDirection = 'down';
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(moveDown, 1000, nextHeadPosition);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
      fieldUpdater(nextFoodIndex, 'food', nextFoodPosition);
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'down';
      watchedState.bodyCoordinates.unshift(head);
      movingTimeout = window.setTimeout(moveDown, 1000, nextHeadPosition);
    }
  };

  const moveLeft = (head) => {
    const nextHeadPosition = {
      row: head.row,
      column: head.column - 1,
      currentDirection: head.nextDirection,
      nextDirection: head.nextDirection,
    };
    const tail = state.tailPosition;
    const nextHeadIndex = findIndex(nextHeadPosition);
    if (head.column < 2 || state.field.cells[nextHeadIndex].content === 'body') {
      watchedState.isGameOver = true;
      return;
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      watchedState.bodyCoordinates.unshift(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
      const newTailPosition = _.last(state.bodyCoordinates);
      fieldUpdater(headIndex, 'tail', newTailPosition, tail);
      const tailIndex = findIndex(tail);
      watchedState.field.cells[tailIndex].content = 'empty';
      if (state.bodyCoordinates.length > 1) {
        fieldUpdater(headIndex, 'body', head);
      } else {
        watchedState.field.cells[headIndex].content = 'empty';
      }
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.tailPosition = newTailPosition;
      watchedState.currentMovementDirection = 'left';
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(moveLeft, 1000, nextHeadPosition);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
      fieldUpdater(nextFoodIndex, 'food', nextFoodPosition);
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = 'left';
      watchedState.bodyCoordinates.unshift(head);
      movingTimeout = window.setTimeout(moveLeft, 1000, nextHeadPosition);
    }
  };

  const moveRight = (head) => {
    const nextHeadPosition = {
      row: head.row,
      column: head.column + 1,
      currentDirection: head.nextDirection,
      nextDirection: head.nextDirection,
    };
    const tail = state.tailPosition;
    const nextHeadIndex = findIndex(nextHeadPosition);
    if (head.column === state.field.difficulty || state.field.cells[nextHeadIndex].content === 'body') {
      watchedState.isGameOver = true;
      return;
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      watchedState.bodyCoordinates.unshift(head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
      const newTailPosition = _.last(state.bodyCoordinates);
      fieldUpdater(headIndex, 'tail', newTailPosition, tail);
      const tailIndex = findIndex(tail);
      watchedState.field.cells[tailIndex].content = 'empty';
      if (state.bodyCoordinates.length > 1) {
        fieldUpdater(headIndex, 'body', head);
      } else {
        watchedState.field.cells[headIndex].content = 'empty';
      }
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.tailPosition = newTailPosition;
      watchedState.currentMovementDirection = 'right';
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(moveRight, 1000, nextHeadPosition);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
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
    const tailPosition = {
      row: headPosition.row,
      column: headPosition.column,
      currentDirection: headPosition.direction,
      nextDirection: headPosition.direction,
      previousDirection: '',
    };
    watchedState.tailPosition = tailPosition;
    watchedState.newHeadPosition = headPosition;
    const foodPosition = generateFoodPosition();

    const headIndex = findIndex(headPosition);
    fieldUpdater(headIndex, 'head', headPosition, null);

    const foodIndex = findIndex(foodPosition);
    fieldUpdater(foodIndex, 'food', foodPosition);

    const tailIndex = findIndex(tailPosition);
    fieldUpdater(tailIndex, 'tail', tailPosition, null);

    moveUp(headPosition);

    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyS':
        case 'ArrowDown':
          if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
            window.clearTimeout(movingTimeout);
            watchedState.newHeadPosition.nextDirection = 'down';
            movingTimeout = window.setTimeout(moveDown, 500, state.newHeadPosition);
          }
          break;
        case 'KeyW':
        case 'ArrowUp':
          if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
            window.clearTimeout(movingTimeout);
            watchedState.newHeadPosition.nextDirection = 'up';
            movingTimeout = window.setTimeout(moveUp, 500, state.newHeadPosition);
          }
          break;
        case 'KeyA':
        case 'ArrowLeft':
          if (state.currentMovementDirection !== 'right' && state.currentMovementDirection !== 'left') {
            window.clearTimeout(movingTimeout);
            watchedState.newHeadPosition.nextDirection = 'left';
            movingTimeout = window.setTimeout(moveLeft, 500, state.newHeadPosition);
          }
          break;
        case 'KeyD':
        case 'ArrowRight':
          if (state.currentMovementDirection !== 'right' && state.currentMovementDirection !== 'left') {
            window.clearTimeout(movingTimeout);
            watchedState.newHeadPosition.nextDirection = 'right';
            movingTimeout = window.setTimeout(moveRight, 500, state.newHeadPosition);
          }
          break;
        default:
      }
    });
  });
};
