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

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const getRandomElement = (array) => array[getRandomInt(0, array.length)];

// ---- start borrowing
//  why doesn't js come with a seeded random? ¯\_(ツ)_/¯
//  https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
//  shoutout to bryc
// MurmurHash
const xmur3 = (str) => {
  for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
      h = h << 13 | h >>> 19;
  return function() {
      h = Math.imul(h ^ h >>> 16, 2246822507);
      h = Math.imul(h ^ h >>> 13, 3266489909);
      return (h ^= h >>> 16) >>> 0;
  }
};
// SimpleFastCounter
const sfc32 = (a, b, c, d) => {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
};
// ---- end borrowing

const makeGetSeededRandomInt = () => {
  const seed = xmur3("HeY_Pr0gRamMerS");
  const getSeededRandom = sfc32(seed(), seed(), seed(), seed());
  return (min, max) => Math.floor(getSeededRandom() * (max - min)) + min;
}

const sigmoid = x => 1 / (1 + Math.E**(-x));

const sleep = ms => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

class GameOver extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'GameOver';
  }
}

module.exports = {
  DIRECTION,
  NODE_DIRECTION_MAP,
  WIDTH: 20,
  HEIGHT: 20,
  SNAKE_START_POS: [5, 5],
  SNAKE_GROW: false,
  START_HEALTH: 50,
  MAX_HEALTH: 400,
  NUM_INPUTS: 4,
  NUM_OUTPUTS: 4,
  EXCESS_COEFFICIENT: 1,
  DISJOINT_COEFFICIENT: 1,
  WEIGHT_DIFF_COEFFICIENT: 4, // 0.3
  SPECIES_COMPATIBILITY_THRESHOLD: 3,
  SPECIES_EXTINCTION_THRESHOLD: 4,
  SPECIES_CULL_RATE: 0.4,
  POPULATION_SIZE: 128,
  PERTURB_WEIGHT_DELTA: .03,
  ALPHA: 'abcdefghijklmnopqrst',
  getRandom,
  getRandomInt,
  getRandomElement,
  makeGetSeededRandomInt,
  sigmoid,
  sleep,
  GameOver
}