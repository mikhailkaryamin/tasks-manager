import AbstractComponent from './abstract-component.js';

class Board extends AbstractComponent {
  getTemplate() {
    return (
      `<section class="board container">
      </section>`
    );
  }
}

export default Board;
