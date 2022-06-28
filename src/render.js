import generateField from './generateField.js';

export default (path, value) => {
  if (path === 'field.difficulty') {
    const body = document.querySelector('body');
    body.textContent = '';
    body.append(generateField(value));
  }
};
