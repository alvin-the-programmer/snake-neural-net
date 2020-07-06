
const { 
  NODE_DIRECTION_MAP,
  GameOver,
  getRandom,
  sleep
} = require('../constants');

const SnakeGame = require('../snake-game');
const NeuralNetwork = require('../neat-neural-network/neural-network');

class FitnessLandscape {
  constructor(neuralNetwork) {
    this.neuralNetwork = neuralNetwork;
  }

  async getFitness(options = { draw: false }) {
    const game = new SnakeGame();

    while (true) {
      const inputs = {};
      const state = game.getState();
      this.neuralNetwork.nodes.input.forEach((node, i) => inputs[node] = state[i]);
      const outputNode = this.neuralNetwork.getOutput(inputs);
      const direction = NODE_DIRECTION_MAP[outputNode];
      game.input(direction);
      try {
        game.simulate();
        if (options.draw) {
          game.draw();
          await sleep(50);
        }
      } catch (error) {
        if (error instanceof GameOver) {
          console.log('GAME OVER!');
          break;
        } else {
          throw error;
        }
      }
    }
    return game.fitness;
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
testLandscape.getFitness({ draw: true }).then(console.log);

module.exports = FitnessLandscape;