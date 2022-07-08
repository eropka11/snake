import _ from 'lodash';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js';
import en from './locales/en.js';
import render from './render.js';

export default () => {
  const state = {
    field: {
      difficulty: '',
      speed: '',
      cells: [],
    },
    error: '',
    language: '',
    finalScore: '',
    coordinatesToUpdate: '',
    currentMovementDirection: 'up',
    newMovementDirection: '',
    newHeadPosition: '',
    tailPosition: '',
    bodyCoordinates: [],
    scoreCounter: 0,
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

  const mover = (head, direction) => {
    const nextHeadPosition = {
      currentDirection: head.nextDirection,
      nextDirection: head.nextDirection,
    };
    const tail = state.tailPosition;
    let nextHeadIndex;
    if (direction === 'up') {
      nextHeadPosition.row = head.row - 1;
      nextHeadPosition.column = head.column;
      nextHeadIndex = findIndex(nextHeadPosition);
      if (head.row < 2 || state.field.cells[nextHeadIndex].content === 'body') {
        watchedState.finalScore = state.scoreCounter;
        return;
      }
    }
    if (direction === 'down') {
      nextHeadPosition.row = head.row + 1;
      nextHeadPosition.column = head.column;
      nextHeadIndex = findIndex(nextHeadPosition);
      if (head.row === state.field.difficulty || state.field.cells[nextHeadIndex].content === 'body') {
        watchedState.finalScore = state.scoreCounter;
        return;
      }
    }
    if (direction === 'left') {
      nextHeadPosition.row = head.row;
      nextHeadPosition.column = head.column - 1;
      nextHeadIndex = findIndex(nextHeadPosition);
      if (head.column < 2 || state.field.cells[nextHeadIndex].content === 'body') {
        watchedState.finalScore = state.scoreCounter;
        return;
      }
    }
    if (direction === 'right') {
      nextHeadPosition.row = head.row;
      nextHeadPosition.column = head.column + 1;
      nextHeadIndex = findIndex(nextHeadPosition);
      if (head.column === state.field.difficulty || state.field.cells[nextHeadIndex].content === 'body') {
        watchedState.finalScore = state.scoreCounter;
        return;
      }
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
      watchedState.currentMovementDirection = direction;
      watchedState.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(mover, state.field.speed, nextHeadPosition, direction);
    }
    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const headIndex = findIndex(head);
      fieldUpdater(headIndex, 'addBody', head);
      fieldUpdater(nextHeadIndex, 'head', nextHeadPosition, head);
      fieldUpdater(nextFoodIndex, 'food', nextFoodPosition);
      watchedState.newHeadPosition = nextHeadPosition;
      watchedState.currentMovementDirection = direction;
      watchedState.bodyCoordinates.unshift(head);
      watchedState.scoreCounter += 1;
      movingTimeout = window.setTimeout(mover, state.field.speed, nextHeadPosition, direction);
    }
  };

  const languageButtons = document.querySelectorAll('button');
  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      watchedState.language = button.id;

      i18next.init({
        lng: state.language,
        debug: true,
        resources: {
          ru,
          en,
        },
      });

      const settingsForm = document.querySelector('form');
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const settingsFormData = new FormData(settingsForm);
        const difficulty = Number(settingsFormData.get('field-size'));
        const speed = Number(settingsFormData.get('speed'));

        if (difficulty === 0) {
          watchedState.error = i18next.t('errors.fieldSizeNotChoosed');
          return;
        }

        if (speed === 0) {
          watchedState.error = i18next.t('errors.snakeSpeedNotChoosed');
          return;
        }

        watchedState.field.difficulty = difficulty;
        watchedState.field.speed = speed;

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

        mover(headPosition, 'up');

        window.addEventListener('keydown', (event) => {
          switch (event.code) {
            case 'KeyS':
            case 'ArrowDown':
              if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
                window.clearTimeout(movingTimeout);
                watchedState.newHeadPosition.nextDirection = 'down';
                movingTimeout = window.setTimeout(
                  mover,
                  state.field.speed / 2,
                  state.newHeadPosition,
                  'down',
                );
              }
              break;
            case 'KeyW':
            case 'ArrowUp':
              if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
                window.clearTimeout(movingTimeout);
                watchedState.newHeadPosition.nextDirection = 'up';
                movingTimeout = window.setTimeout(
                  mover,
                  state.field.speed / 2,
                  state.newHeadPosition,
                  'up',
                );
              }
              break;
            case 'KeyA':
            case 'ArrowLeft':
              if (state.currentMovementDirection !== 'right' && state.currentMovementDirection !== 'left') {
                window.clearTimeout(movingTimeout);
                watchedState.newHeadPosition.nextDirection = 'left';
                movingTimeout = window.setTimeout(
                  mover,
                  state.field.speed / 2,
                  state.newHeadPosition,
                  'left',
                );
              }
              break;
            case 'KeyD':
            case 'ArrowRight':
              if (state.currentMovementDirection !== 'right' && state.currentMovementDirection !== 'left') {
                window.clearTimeout(movingTimeout);
                watchedState.newHeadPosition.nextDirection = 'right';
                movingTimeout = window.setTimeout(
                  mover,
                  state.field.speed / 2,
                  state.newHeadPosition,
                  'right',
                );
              }
              break;
            default:
          }
        });
      });
    });
  });
};
