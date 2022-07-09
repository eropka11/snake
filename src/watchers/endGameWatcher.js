import onChange from 'on-change';

export default (state) => onChange(state, (path, value) => {
  const body = document.querySelector('body');
  const endGameMessege = document.createElement('div');
  const endGameHeader = document.createElement('h1');
  endGameHeader.textContent = `Твой счёт: ${value}`;
  endGameMessege.append(endGameHeader);
  body.textContent = '';
  body.append(endGameMessege);
});
