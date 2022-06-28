import onChange from 'on-change';
import render from './render.js';

export default () => {
  const state = {
    field: {
      difficulty: '',
      rows: [],
    },
  };

  const initiateState = (squareSideLength) => {
    for (let i = 1; i <= squareSideLength; i += 1) {
      const row = {
        rowNumber: i,
        cells: [],
      };
      for (let k = 1; k <= squareSideLength; k += 1) {
        row.cells.push({ cellNumber: k });
      }
      state.field.rows.push(row);
    }
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value);
  });

  const startForm = document.querySelector('form');
  startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const startFormData = new FormData(startForm);
    const difficulty = Number(startFormData.get('difficulty'));
    watchedState.field.difficulty = difficulty;
    initiateState(difficulty);
  });
  console.log(state);
};
