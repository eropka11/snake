import onChange from 'on-change';
import snakeBody from '../images/snakeBody.png';
import snakeBodyRight from '../images/snakeBodyRight.png';
import snakeBodyLeft from '../images/snakeBodyLeft.png';
import snakeBodyDown from '../images/snakeBodyDown.png';
import snakeBodyReversed from '../images/snakeBodyReversed.png';
import snakeBodyRightReversed from '../images/snakeBodyRightReversed.png';
import snakeBodyLeftReversed from '../images/snakeBodyLeftReversed.png';
import snakeBodyDownReversed from '../images/snakeBodyDownReversed.png';
import snakeBodyDownLeft from '../images/snakeBodyDownLeft.png';
import snakeBodyDownRight from '../images/snakeBodyDownRight.png';
import snakeBodyUpRight from '../images/snakeBodyUpRight.png';
import snakeBodyUpLeft from '../images/snakeBodyUpLeft.png';

export default (state) => onChange(state, (path, value) => {
  if (value.head !== undefined) {
    const newBodyPosition = document.querySelector(`[data-row="${value.head.row}"] > [data-column="${value.head.column}"]`);
    const bodyImage = document.createElement('img');
    bodyImage.classList.add('d-block');
    if (value.head.nextDirection === value.head.currentDirection) {
      switch (value.head.currentDirection) {
        case 'up':
          if (value.isReversed) {
            bodyImage.src = snakeBody;
          } else {
            bodyImage.src = snakeBodyReversed;
          }
          break;
        case 'right':
          if (value.isReversed) {
            bodyImage.src = snakeBodyRight;
          } else {
            bodyImage.src = snakeBodyRightReversed;
          }
          break;
        case 'left':
          if (value.isReversed) {
            bodyImage.src = snakeBodyLeft;
          } else {
            bodyImage.src = snakeBodyLeftReversed;
          }
          break;
        case 'down':
          if (value.isReversed) {
            bodyImage.src = snakeBodyDown;
          } else {
            bodyImage.src = snakeBodyDownReversed;
          }
          break;
        default:
          break;
      }
    } else {
      switch (value.head.currentDirection) {
        case 'up':
          if (value.head.nextDirection === 'left') {
            bodyImage.src = snakeBodyDownLeft;
          } else {
            bodyImage.src = snakeBodyDownRight;
          }
          break;
        case 'down':
          if (value.head.nextDirection === 'left') {
            bodyImage.src = snakeBodyUpLeft;
          } else {
            bodyImage.src = snakeBodyUpRight;
          }
          break;
        case 'left':
          if (value.head.nextDirection === 'down') {
            bodyImage.src = snakeBodyDownRight;
          } else {
            bodyImage.src = snakeBodyUpRight;
          }
          break;
        case 'right':
          if (value.head.nextDirection === 'down') {
            bodyImage.src = snakeBodyDownLeft;
          } else {
            bodyImage.src = snakeBodyUpLeft;
          }
          break;
        default:
      }
    }
    newBodyPosition.lastChild.remove();
    newBodyPosition.append(bodyImage);
  }
});
