import onChange from 'on-change';
import snakeBody from '../images/snakeBody.png';
import snakeBodyTurned from '../images/snakeBodyTurned.png';

export default (state) => onChange(state, (path, value) => {
  if (value.head !== undefined) {
    const newBodyPosition = document.querySelector(`[data-row="${value.head.row}"] > [data-column="${value.head.column}"]`);
    const bodyImage = document.createElement('img');
    if (value.head.nextDirection === value.head.currentDirection) {
      bodyImage.src = snakeBody;
      bodyImage.classList.add('d-block');
    } else {
      switch (value.head.currentDirection) {
        case 'up':
          if (value.head.nextDirection === 'left') {
            bodyImage.src = snakeBodyTurned;
            bodyImage.classList.add('d-block', 'downLeft');
          } else {
            bodyImage.src = snakeBodyTurned;
            bodyImage.classList.add('d-block', 'downRight');
          }
          break;
        case 'down':
          if (value.head.nextDirection === 'left') {
            bodyImage.src = snakeBodyTurned;
            bodyImage.classList.add('d-block', 'upLeft');
          } else {
            bodyImage.src = snakeBodyTurned;
            bodyImage.classList.add('d-block', 'upRight');
          }
          break;
        case 'left':
          if (value.head.nextDirection === 'down') {
            bodyImage.src = snakeBodyTurned;
            bodyImage.classList.add('d-block', 'downRight');
          } else {
            bodyImage.src = snakeBodyTurned;
            bodyImage.classList.add('d-block', 'upRight');
          }
          break;
        case 'right':
          if (value.head.nextDirection === 'down') {
            bodyImage.src = snakeBodyTurned;
            bodyImage.classList.add('d-block', 'downLeft');
          } else {
            bodyImage.src = snakeBodyTurned;
            bodyImage.classList.add('d-block', 'upLeft');
          }
          break;
        default:
      }
    }
    newBodyPosition.lastChild.remove();
    newBodyPosition.append(bodyImage);
  }
});
