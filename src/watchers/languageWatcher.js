import onChange from 'on-change';

const showSettings = (lang) => {
  const settingsForm = document.querySelector('form');

  const chooseDifficultDiv = document.createElement('div');
  chooseDifficultDiv.classList.add('text-center');
  const chooseDifficultHeader = document.createElement('h2');
  chooseDifficultHeader.classList.add('mt-3');
  chooseDifficultHeader.textContent = lang('chooseDifficult');
  chooseDifficultDiv.append(chooseDifficultHeader);
  settingsForm.append(chooseDifficultDiv);

  const fieldSizeDiv = document.createElement('div');
  fieldSizeDiv.classList.add('text-center', 'container');
  const fieldSizeHeader = document.createElement('h3');
  fieldSizeHeader.textContent = lang('fieldSize');
  fieldSizeHeader.classList.add('mt-3');
  fieldSizeDiv.append(fieldSizeHeader);

  const rowDivForFieldSize = document.createElement('div');
  rowDivForFieldSize.classList.add('row', 'justify-content-around', 'mt-3');
  fieldSizeDiv.append(rowDivForFieldSize);

  const colDivForSmallSize = document.createElement('div');
  colDivForSmallSize.classList.add('col-12', 'col-sm-3');
  const smallFieldInput = document.createElement('input');
  smallFieldInput.type = 'radio';
  smallFieldInput.value = '10';
  smallFieldInput.id = 'small';
  smallFieldInput.name = 'field-size';
  colDivForSmallSize.append(smallFieldInput);

  const smallFieldLabel = document.createElement('label');
  smallFieldLabel.setAttribute('for', 'small');
  smallFieldLabel.textContent = lang('small');
  colDivForSmallSize.append(smallFieldLabel);
  rowDivForFieldSize.append(colDivForSmallSize);

  const colDivForMediumSize = document.createElement('div');
  colDivForMediumSize.classList.add('col-12', 'col-sm-3');
  const mediumFieldInput = document.createElement('input');
  mediumFieldInput.type = 'radio';
  mediumFieldInput.value = '25';
  mediumFieldInput.id = 'medium-size';
  mediumFieldInput.name = 'field-size';
  colDivForMediumSize.append(mediumFieldInput);

  const mediumFieldLabel = document.createElement('label');
  mediumFieldLabel.setAttribute('for', 'medium-size');
  mediumFieldLabel.textContent = lang('mediumSize');
  colDivForMediumSize.append(mediumFieldLabel);
  rowDivForFieldSize.append(colDivForMediumSize);

  const colDivForLargeSize = document.createElement('div');
  colDivForLargeSize.classList.add('col-12', 'col-sm-3');
  const largeFieldInput = document.createElement('input');
  largeFieldInput.type = 'radio';
  largeFieldInput.value = '50';
  largeFieldInput.id = 'large';
  largeFieldInput.name = 'field-size';
  colDivForLargeSize.append(largeFieldInput);

  const largeFieldLabel = document.createElement('label');
  largeFieldLabel.setAttribute('for', 'large');
  largeFieldLabel.textContent = lang('large');
  colDivForLargeSize.append(largeFieldLabel);
  rowDivForFieldSize.append(colDivForLargeSize);

  settingsForm.append(fieldSizeDiv);

  const snakeSpeedDiv = document.createElement('div');
  snakeSpeedDiv.classList.add('text-center', 'container');
  const snakeSpeedHeader = document.createElement('h3');
  snakeSpeedHeader.classList.add('mt-3');
  snakeSpeedHeader.textContent = lang('speed');
  snakeSpeedDiv.append(snakeSpeedHeader);

  const rowDivForSnakeSpeed = document.createElement('div');
  rowDivForSnakeSpeed.classList.add('row', 'justify-content-around', 'mt-3');
  snakeSpeedDiv.append(rowDivForSnakeSpeed);

  const colDivForSlowSpeed = document.createElement('div');
  colDivForSlowSpeed.classList.add('col-12', 'col-sm-3');
  const slowSpeedInput = document.createElement('input');
  slowSpeedInput.type = 'radio';
  slowSpeedInput.value = '1000';
  slowSpeedInput.id = 'slow';
  slowSpeedInput.name = 'speed';
  colDivForSlowSpeed.append(slowSpeedInput);

  const slowSpeedLabel = document.createElement('label');
  slowSpeedLabel.setAttribute('for', 'slow');
  slowSpeedLabel.textContent = lang('slow');
  colDivForSlowSpeed.append(slowSpeedLabel);
  rowDivForSnakeSpeed.append(colDivForSlowSpeed);

  const colDivForMediumSpeed = document.createElement('div');
  colDivForMediumSpeed.classList.add('col-12', 'col-sm-3');
  const mediumSpeedInput = document.createElement('input');
  mediumSpeedInput.type = 'radio';
  mediumSpeedInput.value = '500';
  mediumSpeedInput.id = 'medium-speed';
  mediumSpeedInput.name = 'speed';
  colDivForMediumSpeed.append(mediumSpeedInput);

  const mediumSpeedLabel = document.createElement('label');
  mediumSpeedLabel.setAttribute('for', 'medium-speed');
  mediumSpeedLabel.textContent = lang('mediumSpeed');
  colDivForMediumSpeed.append(mediumSpeedLabel);
  rowDivForSnakeSpeed.append(colDivForMediumSpeed);

  const colDivForLargeSpeed = document.createElement('div');
  colDivForLargeSpeed.classList.add('col-12', 'col-sm-3');
  const fastSpeedInput = document.createElement('input');
  fastSpeedInput.type = 'radio';
  fastSpeedInput.value = '60';
  fastSpeedInput.id = 'fast';
  fastSpeedInput.name = 'speed';
  colDivForLargeSpeed.append(fastSpeedInput);

  const fastSpeedLabel = document.createElement('label');
  fastSpeedLabel.setAttribute('for', 'fast');
  fastSpeedLabel.textContent = lang('fast');
  colDivForLargeSpeed.append(fastSpeedLabel);
  rowDivForSnakeSpeed.append(colDivForLargeSpeed);

  settingsForm.append(snakeSpeedDiv);

  const submitButtonDiv = document.createElement('div');
  submitButtonDiv.classList.add('text-center', 'mt-3');
  const submitButton = document.createElement('button');
  submitButton.classList.add('btn', 'btn-primary');
  submitButton.type = 'submit';
  submitButton.textContent = lang('play');
  submitButtonDiv.append(submitButton);

  settingsForm.append(submitButtonDiv);
  settingsForm.hidden = false;

  const errorDiv = document.createElement('div');
  errorDiv.classList.add('error');

  settingsForm.append(errorDiv);

  return settingsForm;
};

export default (state) => onChange(state, (path, value) => {
  const header = document.querySelector('#game-header');
  if (header.classList.contains('score')) {
    header.textContent = `${value.currentLang('yourScore')}: ${header.textContent.split(' ')[2]}`;
  } else {
    header.textContent = value.currentLang('snake');
  }

  const settingsForm = document.querySelector('form');
  settingsForm.textContent = '';
  showSettings(value.currentLang);
});
