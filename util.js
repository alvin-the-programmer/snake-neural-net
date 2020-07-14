// ---- start borrowing
//  why doesn't js come with a seeded random? ¯\_(ツ)_/¯
//  https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
//  shoutout to bryc
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
const sfc32 = (a, b, c, d) => {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
};

// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
// shoutout to broofa
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
// ---- end borrowing

const seed = xmur3("for reproducible results!");

const getRandom = (min, max) => Math.random() * (max - min) + min;

const getRandomInt = (min, max) => Math.floor(getRandom(min, max));

const getRandomElement = (array) => array[getRandomInt(0, array.length)];

const randomChance = (rateTrue) => getRandom(0, 1) < rateTrue;

const makeGetSeededRandomInt = () => {
  const seed = xmur3("HeY_Pr0gRamMeRS");
  const getSeededRandom = sfc32(seed(), seed(), seed(), seed());
  return (min, max) => Math.floor(getSeededRandom() * (max - min)) + min;
};

const sleep = ms => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

String.prototype.rJust = function(length, char) {
  const fill = [];
  while (fill.length + this.length < length) {
    fill[fill.length] = char;
  }
  return this + fill.join('');
};

Math.random = sfc32(seed(), seed(), seed(), seed());

module.exports = {
  getRandom,
  getRandomInt,
  getRandomElement,
  randomChance,
  makeGetSeededRandomInt,
  uuidv4,
  sleep
};