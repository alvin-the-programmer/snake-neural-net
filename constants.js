const WIDTH = 20;
const HEIGHT = 20;

const DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

const NODE_DIRECTION_MAP = {
  5: DIRECTION.UP,
  6: DIRECTION.DOWN,
  7: DIRECTION.LEFT,
  8: DIRECTION.RIGHT
};

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRandomElement = (array) => array[Math.floor(getRandom(0, array.length))];

const sigmoid = x => 1 / (1 + Math.E**(-x));

const sleep = ms => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

class GameOver extends Error {
  constructor() {
    super('snake collision');
    this.name = 'GameOver';
  }
}

module.exports = {
  WIDTH,
  HEIGHT,
  DIRECTION,
  NODE_DIRECTION_MAP,
  SNAKE_START_POS: [5, 5],
  SNAKE_GROW: false,
  START_HEALTH: 50,
  MAX_HEALTH: 400,
  NUM_INPUTS: 4,
  NUM_OUTPUTS: 4,
  EXCESS_COEFFICIENT: 1,
  DISJOINT_COEFFICIENT: 1,
  WEIGHT_DIFF_COEFFICIENT: 1,
  SPECIES_COMPATIBILITY_THRESHOLD: 1,
  ALPHA: 'abcdefghijklmnopqrst',
  getRandom,
  getRandomElement,
  sigmoid,
  sleep,
  GameOver
}