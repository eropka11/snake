import _ from 'lodash';
import i18next from 'i18next';
import ru from './locales/ru.js';
import en from './locales/en.js';
import languageWatcher from './watchers/languageWatcher.js';
import errorsWatcher from './watchers/errorsWatcher.js';
import startGameWatcher from './watchers/startGameWatcher.js';
import endGameWatcher from './watchers/endGameWatcher.js';
import headCoordinatesWatcher from './watchers/headCoordinatesWatcher.js';
import foodCoordinatesWatcher from './watchers/foodCoordinatesWatcher.js';
import bodyCoordinatesWatcher from './watchers/bodyCoordinatesWatcher.js';
import tailCoordinatesWatcher from './watchers/tailCoordinatesWatcher.js';

export default () => {
  const state = {
    stateToRender: {
      coordinatesToUpdate: {
        head: '',
        body: '',
        tail: '',
        food: '',
      },
      difficulty: '',
      error: '',
      language: '',
      finalScore: '',
    },
    field: {
      speed: '',
      cells: [],
    },
    currentMovementDirection: 'up',
    newMovementDirection: '',
    newHeadPosition: '',
    tailPosition: '',
    bodyCoordinates: [],
    scoreCounter: 0,
  };

  const watchedState = (path, value) => {
    const watchers = {
      language: languageWatcher(state.stateToRender),
      error: errorsWatcher(state.stateToRender),
      difficulty: startGameWatcher(state.stateToRender),
      finalScore: endGameWatcher(state.stateToRender),
      head: headCoordinatesWatcher(state.stateToRender),
      food: foodCoordinatesWatcher(state.stateToRender),
      body: bodyCoordinatesWatcher(state.stateToRender),
      tail: tailCoordinatesWatcher(state.stateToRender),
    };
    watchers[path][path] = value;
  };

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
        watchedState('finalScore', state.scoreCounter);
        return;
      }
    }

    if (direction === 'down') {
      nextHeadPosition.row = head.row + 1;
      nextHeadPosition.column = head.column;
      nextHeadIndex = findIndex(nextHeadPosition);
      if (head.row === state.difficulty || state.field.cells[nextHeadIndex].content === 'body') {
        watchedState('finalScore', state.scoreCounter);
        return;
      }
    }

    if (direction === 'left') {
      nextHeadPosition.row = head.row;
      nextHeadPosition.column = head.column - 1;
      nextHeadIndex = findIndex(nextHeadPosition);
      if (head.column < 2 || state.field.cells[nextHeadIndex].content === 'body') {
        watchedState('finalScore', state.scoreCounter);
        return;
      }
    }

    if (direction === 'right') {
      nextHeadPosition.row = head.row;
      nextHeadPosition.column = head.column + 1;
      nextHeadIndex = findIndex(nextHeadPosition);
      if (head.column === state.difficulty || state.field.cells[nextHeadIndex].content === 'body') {
        watchedState('finalScore', state.scoreCounter);
        return;
      }
    }
    if (state.field.cells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head);
      state.bodyCoordinates.unshift(head);

      watchedState('head', { nextHeadPosition, head });
      state.field.cells[nextHeadIndex].content = 'head';

      const nextTailPosition = _.last(state.bodyCoordinates);
      watchedState('tail', { nextTailPosition, tail });
      state.field.cells[headIndex].content = 'tail';
      const tailIndex = findIndex(tail);
      state.field.cells[tailIndex].content = 'empty';

      if (state.bodyCoordinates.length > 1) {
        watchedState('body', { head });
        state.field.cells[headIndex].content = 'body';
      } else {
        state.field.cells[headIndex].content = 'empty';
      }

      state.newHeadPosition = nextHeadPosition;
      state.tailPosition = nextTailPosition;
      state.currentMovementDirection = direction;
      state.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(mover, state.field.speed, nextHeadPosition, direction);
    }

    if (state.field.cells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition();
      const nextFoodIndex = findIndex(nextFoodPosition);
      const nextBodyIndex = findIndex(head);
      watchedState('body', { head });
      state.field.cells[nextBodyIndex].content = 'body';

      watchedState('head', { nextHeadPosition, head });
      state.field.cells[nextHeadIndex].content = 'head';
      state.newHeadPosition = nextHeadPosition;

      watchedState('food', { nextFoodPosition });
      state.field.cells[nextFoodIndex].content = 'food';

      state.currentMovementDirection = direction;
      state.bodyCoordinates.unshift(head);
      state.scoreCounter += 1;
      movingTimeout = window.setTimeout(mover, state.field.speed, nextHeadPosition, direction);
    }
  };

  const languageButtons = document.querySelectorAll('button');
  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      watchedState('language', button.id);

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
          watchedState('error', i18next.t('errors.fieldSizeNotChoosed'));
          return;
        }

        if (speed === 0) {
          watchedState('error', i18next.t('errors.snakeSpeedNotChoosed'));
          return;
        }

        watchedState('difficulty', difficulty);
        state.field.speed = speed;

        initiateState(difficulty);
        const nextHeadPosition = generateHeadPosition(difficulty);
        const nextTailPosition = {
          row: nextHeadPosition.row,
          column: nextHeadPosition.column,
          currentDirection: nextHeadPosition.direction,
          nextDirection: nextHeadPosition.direction,
          previousDirection: '',
        };
        state.tailPosition = nextTailPosition;
        state.newHeadPosition = nextHeadPosition;
        const nextFoodPosition = generateFoodPosition();

        const headIndex = findIndex(nextHeadPosition);
        watchedState('head', { nextHeadPosition });
        state.field.cells[headIndex].content = 'head';

        const foodIndex = findIndex(nextFoodPosition);
        watchedState('food', { nextFoodPosition });
        state.field.cells[foodIndex].content = 'food';

        const tailIndex = findIndex(nextTailPosition);
        watchedState('tail', { nextTailPosition });
        state.field.cells[tailIndex].content = 'tail';

        mover(nextHeadPosition, 'up');

        window.addEventListener('keydown', (event) => {
          switch (event.code) {
            case 'KeyS':
            case 'ArrowDown':
              if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
                window.clearTimeout(movingTimeout);
                state.newHeadPosition.nextDirection = 'down';
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
                state.newHeadPosition.nextDirection = 'up';
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
                state.newHeadPosition.nextDirection = 'left';
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
                state.newHeadPosition.nextDirection = 'right';
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
