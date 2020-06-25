const WIDTH = 20;
const HEIGHT = 20;
const ALPHA = 'abcdefghijklmnopqrst';
const SNAKE_START_POS = [ 5, 5 ];
const START_HEALTH = 50;
const MAX_FITNESS = 400;

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
  START_HEALTH,
  MAX_FITNESS,
  GameOver
};
