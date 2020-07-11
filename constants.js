const DIRECTION = {
  STRAIGHT: 'straight',
  TURN_LEFT: 'turnLeft',
  TURN_RIGHT: 'turnRight'
};

const OUTPUT_NODE_MAP = {
  7: DIRECTION.STRAIGHT,
  8: DIRECTION.TURN_LEFT,
  9: DIRECTION.TURN_RIGHT
};

const SNAKE_ORIENTATION_SYMBOL = {
  0: '↑',
  90: '→',
  180: '↓',
  270: '←'
};

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


const seed = xmur3("for reproducible results!");

Math.random = sfc32(seed(), seed(), seed(), seed());

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRandomInt = (min, max) => Math.floor(getRandom(min, max));

const getRandomElement = (array) => array[getRandomInt(0, array.length)];

const randomChance = (rateTrue) => getRandom(0, 1) < rateTrue;

const makeGetSeededRandomInt = () => {
  const seed = xmur3("HeY_Pr0gRamMeRS");
  const getSeededRandom = sfc32(seed(), seed(), seed(), seed());
  return (min, max) => Math.floor(getSeededRandom() * (max - min)) + min;
}

const sigmoid = x => 1 / (1 + Math.E**(-x));

const modifiedSigmoid = x => 1 / (1 + Math.E**(-4.9 * x));

const distanceNormalizer = x => Math.log(x + 1) / Math.log(21);

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
  OUTPUT_NODE_MAP,
  SNAKE_ORIENTATION_SYMBOL,
  WIDTH: 20,
  HEIGHT: 20,
  SNAKE_START_POS: [5, 5],
  SNAKE_GROW: true,
  START_HEALTH: 50,
  MAX_HEALTH: 50,
  MAX_FITNESS: 35,
  NUM_INPUTS: 6,
  NUM_OUTPUTS: 3,
  NUMBER_GENERATIONS: 32,
  EXCESS_COEFFICIENT: 1,
  DISJOINT_COEFFICIENT: 1,
  WEIGHT_DIFF_COEFFICIENT: 0.3,
  SPECIES_COMPATIBILITY_THRESHOLD: 3,
  SPECIES_EXTINCTION_THRESHOLD: 3,
  SPECIES_CULL_RATE: 0.3,
  POPULATION_SIZE: 150,
  PERTURB_WEIGHT_DELTA: .03,
  CROSSOVER_RATE: 0.75,
  INHERIT_DISABLED_GENE_RATE: 0.75,
  MUTATION_RATE: {
    WEIGHT: 0.8,
    WEIGHT_PERTURB: 0.9,
    NEW_NODE: 0.03,
    NEW_CONNECTION: 0.05 
  },
  ALPHA: 'abcdefghijklmnopqrst',
  getRandom,
  getRandomInt,
  getRandomElement,
  randomChance,
  makeGetSeededRandomInt,
  sigmoid,
  modifiedSigmoid,
  distanceNormalizer,
  sleep,
  GameOver
};
