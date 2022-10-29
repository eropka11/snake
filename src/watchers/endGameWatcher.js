import onChange from 'on-change';
import i18next from 'i18next';

export default (state) => onChange(state, (path, value) => {
  document.querySelector('.game-zone').remove();
  const header = document.querySelector('#game-header');
  header.textContent = `${i18next.t('yourScore')}: ${value}`;
  header.hidden = false;
  document.querySelector('select').hidden = false;
  document.querySelector('form').hidden = false;
});
