class GameOver extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'GameOver';
  }
}

const sigmoid = x => 1 / (1 + Math.E**(-x));

const modifiedSigmoid = x => 1 / (1 + Math.E**(-4.9 * x));

const distanceNormalizer = x => Math.log(x + 1) / Math.log(21);

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

module.exports = {
  DIRECTION,
  OUTPUT_NODE_MAP,
  SNAKE_ORIENTATION_SYMBOL,
  WIDTH: 20,
  HEIGHT: 20,
  SNAKE_START_POS: [5, 5],
  SNAKE_GROW: true,
  START_HEALTH: 50,
  MAX_HEALTH: 300,
  MAX_FITNESS: 64,
  LOG_SPECIMEN: true,
  LOG_SPECIMEN_FITNESS_THRESHOLD: 30,
  NUM_INPUTS: 6,
  NUM_OUTPUTS: 3,
  NUMBER_GENERATIONS: 32,
  EXCESS_COEFFICIENT: 4,
  DISJOINT_COEFFICIENT: 4,
  WEIGHT_DIFF_COEFFICIENT: 0.3,
  SPECIES_COMPATIBILITY_THRESHOLD: 3,
  SPECIES_EXTINCTION_THRESHOLD: 2,
  SPECIES_CULL_RATE: 0.30,
  POPULATION_SIZE: 150,
  PERTURB_WEIGHT_DELTA: .03,
  CROSSOVER_RATE: 0.50,
  INHERIT_DISABLED_GENE_RATE: 0.75,
  ANIMATION_FRAME_DELAY: 15,
  MUTATION_RATE: {
    WEIGHT: 0.8,
    WEIGHT_PERTURB: 0.9,
    NEW_NODE: 0.03,
    NEW_CONNECTION: 0.05 
  },
  sigmoid,
  modifiedSigmoid,
  distanceNormalizer,
  GameOver
};
