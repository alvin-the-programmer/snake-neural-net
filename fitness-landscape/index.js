
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

  calculateFitness() {
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
      } catch (error) {
        if (error instanceof GameOver) {
          break;
        } else {
          throw error;
        }
      }
    } 

    return game.fitness;
  }

  async animate() {
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
        game.draw();
        await sleep(60);
      } catch (error) {
        if (error instanceof GameOver) {
          console.log('GAME OVER!');
          break;
        } else {
          throw error;
        }
      }
    } 
    console.log({ 
      nodes: this.neuralNetwork.nodes,
      connections: this.neuralNetwork.connections,
      fitness: game.fitness 
    });
  }
}


// const testNet = new NeuralNetwork(
//   { input: [ 1, 2, 3, 4 ], hidden: [], output: [ 5, 6, 7, 8 ] },
//   {
//     '1,5': { weight: 0.44114997368102715, enabled: true },
//     '1,6': { weight: -0.30235507209589185, enabled: true },
//     '1,8': { weight: 0.5710266010605838, enabled: true },
//     '3,6': { weight: 0.1161890314107783, enabled: true },
//     '3,7': { weight: -0.99483817128508, enabled: true },
//     '4,6': { weight: -0.26202206313558696, enabled: true },
//     '4,7': { weight: -0.37966563478271054, enabled: true },
//     '1,7': { weight: -0.0064090885068370795, enabled: true },
//     '2,5': { weight: 0.8545105132884738, enabled: true },
//     '2,6': { weight: 0.6793230219960051, enabled: true },
//     '2,7': { weight: -0.8634802895323817, enabled: true },
//     '2,8': { weight: -0.6559088420827552, enabled: true },
//     '3,5': { weight: -0.3869577766949446, enabled: true },
//     '3,8': { weight: -0.6415809843907354, enabled: true },
//     '4,5': { weight: -0.7651990674593883, enabled: true },
//     '4,8': { weight: 0.9025959376195098, enabled: true }
//   }
// );

// const testFitness = new FitnessLandscape(testNet);
// testFitness.animate();

module.exports = FitnessLandscape;