const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRandomElement = (array) => array[Math.floor(getRandom(0, array.length))];

module.exports = {
  NUM_INPUTS: 20 * 20,
  NUM_OUTPUTS: 4,
  EXCESS_COEFFICIENT: 1,
  DISJOINT_COEFFICIENT: 1,
  WEIGHT_DIFF_COEFFICIENT: 1,
  SPECIES_COMPATIBILITY_THRESHOLD: 1,
  getRandom,
  getRandomElement
}