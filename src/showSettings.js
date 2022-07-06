import i18next from 'i18next';
import ru from './locales/ru.js';
import en from './locales/en.js';

export default (lang) => {
  i18next.init({
    lng: lang,
    debug: true,
    resources: {
      ru,
      en,
    },
  });

  const settingsForm = document.createElement('form');

  const chooseDifficultDiv = document.createElement('div');
  const chooseDifficultHeader = document.createElement('h2');
  chooseDifficultHeader.textContent = i18next.t('chooseDifficult');
  chooseDifficultDiv.append(chooseDifficultHeader);
  settingsForm.append(chooseDifficultDiv);

  const fieldSizeDiv = document.createElement('div');
  const fieldSizeHeader = document.createElement('h3');
  fieldSizeHeader.textContent = i18next.t('fieldSize');
  fieldSizeDiv.append(fieldSizeHeader);

  const smallFieldInput = document.createElement('input');
  smallFieldInput.type = 'radio';
  smallFieldInput.value = '10';
  smallFieldInput.id = 'small';
  smallFieldInput.name = 'field-size';
  fieldSizeDiv.append(smallFieldInput);

  const smallFieldLabel = document.createElement('label');
  smallFieldLabel.for = 'small';
  smallFieldLabel.textContent = i18next.t('small');
  fieldSizeDiv.append(smallFieldLabel);

  const mediumFieldInput = document.createElement('input');
  mediumFieldInput.type = 'radio';
  mediumFieldInput.value = '25';
  mediumFieldInput.id = 'medium-size';
  mediumFieldInput.name = 'field-size';
  fieldSizeDiv.append(mediumFieldInput);

  const mediumFieldLabel = document.createElement('label');
  mediumFieldLabel.for = 'medium-size';
  mediumFieldLabel.textContent = i18next.t('mediumSize');
  fieldSizeDiv.append(mediumFieldLabel);

  const largeFieldInput = document.createElement('input');
  largeFieldInput.type = 'radio';
  largeFieldInput.value = '50';
  largeFieldInput.id = 'large';
  largeFieldInput.name = 'field-size';
  fieldSizeDiv.append(largeFieldInput);

  const largeFieldLabel = document.createElement('label');
  largeFieldLabel.for = 'large';
  largeFieldLabel.textContent = i18next.t('large');
  fieldSizeDiv.append(largeFieldLabel);

  const xLargeFieldInput = document.createElement('input');
  xLargeFieldInput.type = 'radio';
  xLargeFieldInput.value = '100';
  xLargeFieldInput.id = 'x-large';
  xLargeFieldInput.name = 'field-size';
  fieldSizeDiv.append(xLargeFieldInput);

  const xLargeFieldLabel = document.createElement('label');
  xLargeFieldLabel.for = 'x-large';
  xLargeFieldLabel.textContent = i18next.t('xLarge');
  fieldSizeDiv.append(xLargeFieldLabel);

  settingsForm.append(fieldSizeDiv);

  const snakeSpeedDiv = document.createElement('div');
  const snakeSpeedHeader = document.createElement('h3');
  snakeSpeedHeader.textContent = i18next.t('speed');
  snakeSpeedDiv.append(snakeSpeedHeader);

  const slowSpeedInput = document.createElement('input');
  slowSpeedInput.type = 'radio';
  slowSpeedInput.value = '1000';
  slowSpeedInput.id = 'slow';
  slowSpeedInput.name = 'speed';
  snakeSpeedDiv.append(slowSpeedInput);

  const slowSpeedLabel = document.createElement('label');
  slowSpeedLabel.for = 'slow';
  slowSpeedLabel.textContent = i18next.t('slow');
  snakeSpeedDiv.append(slowSpeedLabel);

  const mediumSpeedInput = document.createElement('input');
  mediumSpeedInput.type = 'radio';
  mediumSpeedInput.value = '500';
  mediumSpeedInput.id = 'medium-speed';
  mediumSpeedInput.name = 'speed';
  snakeSpeedDiv.append(mediumSpeedInput);

  const mediumSpeedLabel = document.createElement('label');
  mediumSpeedLabel.for = 'medium-speed';
  mediumSpeedLabel.textContent = i18next.t('mediumSpeed');
  snakeSpeedDiv.append(mediumSpeedLabel);

  const fastSpeedInput = document.createElement('input');
  fastSpeedInput.type = 'radio';
  fastSpeedInput.value = '200';
  fastSpeedInput.id = 'fast';
  fastSpeedInput.name = 'speed';
  snakeSpeedDiv.append(fastSpeedInput);

  const fastSpeedLabel = document.createElement('label');
  fastSpeedLabel.for = 'fast';
  fastSpeedLabel.textContent = i18next.t('fast');
  snakeSpeedDiv.append(fastSpeedLabel);

  const veryFastSpeedInput = document.createElement('input');
  veryFastSpeedInput.type = 'radio';
  veryFastSpeedInput.value = '50';
  veryFastSpeedInput.id = 'very-fast';
  veryFastSpeedInput.name = 'speed';
  snakeSpeedDiv.append(veryFastSpeedInput);

  const veryFastSpeedLabel = document.createElement('label');
  veryFastSpeedLabel.for = 'very-fast';
  veryFastSpeedLabel.textContent = i18next.t('veryFast');
  snakeSpeedDiv.append(veryFastSpeedLabel);

  settingsForm.append(snakeSpeedDiv);

  const submitButtonDiv = document.createElement('div');
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = i18next.t('play');
  submitButtonDiv.append(submitButton);

  settingsForm.append(submitButtonDiv);

  return settingsForm;
};
