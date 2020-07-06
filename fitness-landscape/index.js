
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
          await sleep(40);
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

    return { 
      connections: this.neuralNetwork.connections,
      fitness: game.fitness 
    };
  }
}

const nodes = {
  input: [1, 2, 3, 4],
  hidden: [9, 10, 11],
  output: [5, 6, 7, 8]
};

// const connections = {};

// nodes.input.forEach(a => {
//   nodes.hidden.forEach(b => {
//     const edge = a + ',' + b;
//     connections[edge] = { weight: getRandom(-1, 1), enabled: true };
//   });
// });

// nodes.hidden.forEach(b => {
//   nodes.output.forEach(c => {
//     const edge = b + ',' + c;
//     connections[edge] = { weight: getRandom(-1, 1), enabled: true };
//   });
// });

// a cool nn
const connections = {
  '1,9': { weight: -0.14245855223754678, enabled: true },
  '1,10': { weight: 0.747072241231086, enabled: true },
  '1,11': { weight: 0.2700064339885557, enabled: true },
  '2,9': { weight: -0.28060123209799404, enabled: true },
  '2,10': { weight: -0.9807653455758221, enabled: true },
  '2,11': { weight: -0.6817294444254518, enabled: true },
  '3,9': { weight: -0.31732404449336826, enabled: true },
  '3,10': { weight: 0.24531075426264914, enabled: true },
  '3,11': { weight: 0.3719454776590938, enabled: true },
  '4,9': { weight: 0.0016452528372812303, enabled: true },
  '4,10': { weight: -0.33326662054760936, enabled: true },
  '4,11': { weight: -0.3767882337292576, enabled: true },
  '9,5': { weight: -0.568646626879957, enabled: true },
  '9,6': { weight: 0.4372179052044842, enabled: true },
  '9,7': { weight: -0.1776321143722961, enabled: true },
  '9,8': { weight: -0.7625010601926401, enabled: true },
  '10,5': { weight: 0.6543695078266656, enabled: true },
  '10,6': { weight: -0.798014442905874, enabled: true },
  '10,7': { weight: -0.47319995475659526, enabled: true },
  '10,8': { weight: 0.9989284625345465, enabled: true },
  '11,5': { weight: -0.19579938588649481, enabled: true },
  '11,6': { weight: 0.4213381230467257, enabled: true },
  '11,7': { weight: -0.37573990507446187, enabled: true },
  '11,8': { weight: 0.1388386299827662, enabled: true }
}


const testNetwork = new NeuralNetwork(nodes, connections);
const testLandscape = new FitnessLandscape(testNetwork);
testLandscape.getFitness({ draw: true }).then(console.log);

module.exports = FitnessLandscape;