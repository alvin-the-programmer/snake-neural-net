
const { 
  NODE_DIRECTION_MAP,
  getRandom,
  sleep
} = require('../constants');
const SnakeGame = require('../snake-game');
const NeuralNetwork = require('../neat-neural-network/neural-network');


class FitnessLandscape {
  constructor(neuralNetwork) {
    this.neuralNetwork = neuralNetwork;
  }

  async getFitness() {
    const game = new SnakeGame();
    while (true) {
      const inputs = {};
      const state = game.getState();
      this.neuralNetwork.nodes.input.forEach((node, i) => inputs[node] = state[i]);
      const outputNode = this.neuralNetwork.getOutput(inputs);
      const direction = NODE_DIRECTION_MAP[outputNode];
      game.input(direction);
      game.simulate({ draw: true });
      await sleep(50);
    }
  }
}

const nodes = {
  input: [1, 2, 3, 4],
  hidden: [9, 10, 11],
  output: [5, 6, 7, 8]
};

const connections = {};

nodes.input.forEach(a => {
  nodes.hidden.forEach(b => {
    const edge = a + ',' + b;
    connections[edge] = { weight: getRandom(-1, 1), enabled: true };
  });
});

nodes.hidden.forEach(b => {
  nodes.output.forEach(c => {
    const edge = b + ',' + c;
    connections[edge] = { weight: getRandom(-1, 1), enabled: true };
  });
});


const testNetwork = new NeuralNetwork(nodes, connections);
const testLandscape = new FitnessLandscape(testNetwork);
testLandscape.getFitness();

module.exports = FitnessLandscape;