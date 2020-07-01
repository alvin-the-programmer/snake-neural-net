const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRandomElement = (array) => array[Math.floor(getRandom(0, array.length))];

class GameOver extends Error {
  constructor() {
    super('snake collision');
    this.name = 'GameOver';
  }
}

module.exports = {
  WIDTH: 20,
  HEIGHT: 20,
  ALPHA: 'abcdefghijklmnopqrst',
  SNAKE_START_POS: [5, 5],
  START_HEALTH: 50,
  MAX_HEALTH: 400,
  NUM_INPUTS: 20 * 20,
  NUM_OUTPUTS: 4,
  EXCESS_COEFFICIENT: 1,
  DISJOINT_COEFFICIENT: 1,
  WEIGHT_DIFF_COEFFICIENT: 1,
  SPECIES_COMPATIBILITY_THRESHOLD: 1,
  getRandom,
  getRandomElement,
  GameOver
}