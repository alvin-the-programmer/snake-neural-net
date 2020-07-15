const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRandomInt = (min, max) => Math.floor(getRandom(min, max));

const getRandomElement = (array) => array[getRandomInt(0, array.length)];

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
  getRandom,
  getRandomInt,
  getRandomElement,
  modifiedSigmoid,
  distanceNormalizer,
  sleep,
  GameOver
};