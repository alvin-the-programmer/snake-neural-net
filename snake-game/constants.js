const WIDTH = 20;
const HEIGHT = 20;
const ALPHA = 'abcdefghijklmnopqrst';
const SNAKE_START_POS = [ 5, 5 ];

class GameOver extends Error {
  constructor() {
    super('snake collision');
    this.name = 'GameOver';
  }
}

module.exports = {
  WIDTH,
  HEIGHT,
  ALPHA,
  SNAKE_START_POS,
  GameOver
};
