import onChange from 'on-change';
import i18next from 'i18next';

export default (state) => onChange(state, (path, value) => {
  const body = document.querySelector('body');

  const scoreMessage = document.createElement('div');
  scoreMessage.classList.add('text-center');
  const scoreHeader = document.createElement('h1');
  scoreHeader.textContent = `${i18next.t('yourScore')}: ${value}`;
  scoreMessage.append(scoreHeader);

  const restartButton = document.createElement('button');
  restartButton.textContent = i18next.t('restart');
  restartButton.classList.add('btn', 'btn-primary');
  restartButton.id = 'restart-button';

  const optionsButton = document.createElement('button');
  optionsButton.textContent = i18next.t('settings');
  optionsButton.classList.add('btn', 'btn-primary');
  optionsButton.id = 'options-button';

  const buttonsBox = document.createElement('div');
  buttonsBox.append(restartButton, optionsButton);
  buttonsBox.classList.add('text-center');

  body.textContent = '';
  body.append(scoreMessage, buttonsBox);
});
