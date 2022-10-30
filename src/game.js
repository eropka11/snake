import _ from 'lodash';
import Hammer from 'hammerjs';
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
import {
  initiateState, generateHeadPosition, generateFoodPosition, findIndex, stateReset,
} from './handlers.js';

export default () => {
  let state = {
    stateToRender: {
      coordinatesToUpdate: {
        head: '',
        body: '',
        tail: '',
        food: '',
      },
      fieldParameters: {
        rowsAmount: '',
        columnsAmount: '',
        minValue: '',
      },
      error: '',
      language: {
        currentLang: '',
        isChanged: false,
      },
      finalScore: '',
    },
    isBodyReversed: false,
    fieldCells: '',
    speed: '',
    currentMovementDirection: 'up',
    newMovementDirection: '',
    newHeadPosition: '',
    tailPosition: '',
    bodyCoordinates: [],
    scoreCounter: 0,
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
      en,
    },
  });

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

  watchedState('language', { currentLang: i18next.t, isChanged: false });
  const languageChanger = document.querySelector('#lang-changer');
  languageChanger.addEventListener('change', (e) => {
    e.preventDefault();
    state.stateToRender.language.isChanged = true;
    i18next.changeLanguage(languageChanger.value);
    watchedState('language', { currentLang: i18next.t, isChanged: false });
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
      nextHeadIndex = findIndex(nextHeadPosition, state.fieldCells);
      if (head.row < 2 || state.fieldCells[nextHeadIndex].content === 'body') {
        watchedState('finalScore', state.scoreCounter);
        state = stateReset();
        initiateState();
        return;
      }
    }

    if (direction === 'down') {
      nextHeadPosition.row = head.row + 1;
      nextHeadPosition.column = head.column;
      nextHeadIndex = findIndex(nextHeadPosition, state.fieldCells);
      if (head.row === state.stateToRender.difficulty.rowsAmount || state.fieldCells[nextHeadIndex].content === 'body') {
        watchedState('finalScore', state.scoreCounter);
        state = stateReset();
        initiateState();
        return;
      }
    }

    if (direction === 'left') {
      nextHeadPosition.row = head.row;
      nextHeadPosition.column = head.column - 1;
      nextHeadIndex = findIndex(nextHeadPosition, state.fieldCells);
      if (head.column < 2 || state.fieldCells[nextHeadIndex].content === 'body') {
        watchedState('finalScore', state.scoreCounter);
        state = stateReset();
        initiateState();
        return;
      }
    }

    if (direction === 'right') {
      nextHeadPosition.row = head.row;
      nextHeadPosition.column = head.column + 1;
      nextHeadIndex = findIndex(nextHeadPosition, state.fieldCells);
      if (head.column === state.stateToRender.difficulty.columnsAmount || state.fieldCells[nextHeadIndex].content === 'body') {
        watchedState('finalScore', state.scoreCounter);
        state = stateReset();
        initiateState();
        return;
      }
    }

    if (state.fieldCells[nextHeadIndex].content === 'empty') {
      const headIndex = findIndex(head, state.fieldCells);
      state.bodyCoordinates.unshift(head);

      watchedState('head', { nextHeadPosition, head });
      state.fieldCells[nextHeadIndex].content = 'head';

      const nextTailPosition = _.last(state.bodyCoordinates);
      watchedState('tail', { nextTailPosition, tail });
      state.fieldCells[headIndex].content = 'tail';
      const tailIndex = findIndex(tail, state.fieldCells);
      state.fieldCells[tailIndex].content = 'empty';

      if (state.bodyCoordinates.length > 1) {
        state.isBodyReversed = !state.isBodyReversed;
        watchedState('body', { head, isReversed: state.isBodyReversed });
        state.fieldCells[headIndex].content = 'body';
      } else {
        state.fieldCells[headIndex].content = 'empty';
      }

      state.newHeadPosition = nextHeadPosition;
      state.tailPosition = nextTailPosition;
      state.currentMovementDirection = direction;
      state.bodyCoordinates.pop();
      movingTimeout = window.setTimeout(mover, state.speed, nextHeadPosition, direction);
    }

    if (state.fieldCells[nextHeadIndex].content === 'food') {
      const nextFoodPosition = generateFoodPosition(state.fieldCells);
      console.log(nextFoodPosition);
      const nextFoodIndex = findIndex(nextFoodPosition, state.fieldCells);
      const nextBodyIndex = findIndex(head, state.fieldCells);
      state.isBodyReversed = !state.isBodyReversed;
      watchedState('body', { head, isReversed: state.isBodyReversed });
      state.fieldCells[nextBodyIndex].content = 'body';

      watchedState('head', { nextHeadPosition, head });
      state.fieldCells[nextHeadIndex].content = 'head';
      state.newHeadPosition = nextHeadPosition;

      watchedState('food', { nextFoodPosition });
      state.fieldCells[nextFoodIndex].content = 'food';

      state.currentMovementDirection = direction;
      state.bodyCoordinates.unshift(head);
      state.scoreCounter += 1;
      movingTimeout = window.setTimeout(mover, state.speed, nextHeadPosition, direction);
    }
  };

  const settingsForm = document.querySelector('#settings');
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

    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;
    const fieldParameters = { minValue: difficulty };

    if (screenWidth > screenHeight) {
      fieldParameters.columnsAmount = Math.floor((screenWidth / screenHeight) * difficulty);
      fieldParameters.rowsAmount = difficulty;
    } else if (screenWidth < screenHeight) {
      fieldParameters.columnsAmount = difficulty;
      fieldParameters.rowsAmount = Math.floor((screenHeight / screenWidth) * difficulty);
    } else {
      fieldParameters.rowsAmount = difficulty;
      fieldParameters.columnsAmount = difficulty;
    }

    watchedState('difficulty', fieldParameters);
    state.speed = speed;

    state.fieldCells = initiateState(fieldParameters);
    const nextHeadPosition = generateHeadPosition(fieldParameters);
    const nextTailPosition = {
      row: nextHeadPosition.row,
      column: nextHeadPosition.column,
      currentDirection: nextHeadPosition.direction,
      nextDirection: nextHeadPosition.direction,
      previousDirection: '',
    };
    state.tailPosition = nextTailPosition;
    state.newHeadPosition = nextHeadPosition;
    const nextFoodPosition = generateFoodPosition(state.fieldCells);

    const headIndex = findIndex(nextHeadPosition, state.fieldCells);
    watchedState('head', { nextHeadPosition });
    state.fieldCells[headIndex].content = 'head';

    const foodIndex = findIndex(nextFoodPosition, state.fieldCells);
    watchedState('food', { nextFoodPosition });
    state.fieldCells[foodIndex].content = 'food';

    const tailIndex = findIndex(nextTailPosition, state.fieldCells);
    watchedState('tail', { nextTailPosition });
    state.fieldCells[tailIndex].content = 'tail';

    mover(nextHeadPosition, 'up');
  });

  const movingChanger = (newDirection) => {
    window.clearTimeout(movingTimeout);
    state.newHeadPosition.nextDirection = newDirection;
    movingTimeout = window.setTimeout(
      mover,
      state.speed / 2,
      state.newHeadPosition,
      newDirection,
    );
  };

  const gameField = document.querySelector('body');
  const hammerManager = new Hammer.Manager(gameField);
  const swipe = new Hammer.Swipe();
  hammerManager.add(swipe);
  hammerManager.on('swipeleft', () => {
    if (state.currentMovementDirection === 'up' || state.currentMovementDirection === 'down') {
      movingChanger('left');
    }
  });
  hammerManager.on('swiperight', () => {
    if (state.currentMovementDirection === 'up' || state.currentMovementDirection === 'down') {
      movingChanger('right');
    }
  });
  hammerManager.on('swipeup', () => {
    if (state.currentMovementDirection === 'left' || state.currentMovementDirection === 'right') {
      movingChanger('up');
    }
  });
  hammerManager.on('swipedown', () => {
    if (state.currentMovementDirection === 'left' || state.currentMovementDirection === 'right') {
      movingChanger('down');
    }
  });

  gameField.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyS':
      case 'ArrowDown':
        if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
          movingChanger('down');
        }
        break;
      case 'KeyW':
      case 'ArrowUp':
        if (state.currentMovementDirection !== 'up' && state.currentMovementDirection !== 'down') {
          movingChanger('up');
        }
        break;
      case 'KeyA':
      case 'ArrowLeft':
        if (state.currentMovementDirection !== 'right' && state.currentMovementDirection !== 'left') {
          movingChanger('left');
        }
        break;
      case 'KeyD':
      case 'ArrowRight':
        if (state.currentMovementDirection !== 'right' && state.currentMovementDirection !== 'left') {
          movingChanger('right');
        }
        break;
      default:
        break;
    }
  });
};
