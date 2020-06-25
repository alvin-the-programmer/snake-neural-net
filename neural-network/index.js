class Neuron {
  constructor(weights, bias) {
    this.weights = weights;
    this.bias = bias;
  }

  activate(inputs) {
    if (inputs.length !== this.weights.length)
      throw Error('num inputs does not match num weights');

    const weightedSum = inputs.reduce((sum, input, idx) => sum + (input * this.weights[idx]), 0);
    return weightedSum + this.bias;
  }
}


