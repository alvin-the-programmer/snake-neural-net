const sigmoid = x => 1 / (1 + Math.E**(-x));
const getRandom = (min, max) => Math.random() * (max - min) + min;
const getRandomWeightArray = size => new Array(size).fill().map(() => getRandom(-1, 1));

class Neuron {
  constructor(weights, bias) {
    this.weights = weights;
    this.bias = bias;
  }

  activate(inputs) {
    if (inputs.length !== this.weights.length)
      throw Error('num inputs does not match num weights');

    const weightedSum = inputs.reduce((sum, input, idx) => sum + (input * this.weights[idx]), 0);
    return sigmoid(weightedSum + this.bias);
  }
}

// Neural Network
//    - Inputs search space = ~2^400 * 400 * 400
//      - 20x20 grid = 400 bool-pixels = 2^(400) possibilities
//      - food position = 400 possibilities
//      - head position = 400 possibilities
//    - Outputs = 4
//      - up
//      - down
//      - left
//      - right
