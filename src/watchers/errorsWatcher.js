import onChange from 'on-change';

export default (state) => onChange(state, (path, value) => {
  const errorDiv = document.querySelector('.error');
  const errorHeader = document.createElement('h4');
  if (errorDiv.lastChild !== null) {
    errorDiv.lastChild.remove();
  }
  errorHeader.textContent = value;
  errorDiv.append(errorHeader);
});
