
const { 
  NODE_DIRECTION_MAP,
  GameOver,
  getRandom,
  sleep
} = require('../constants');

const SnakeGame = require('../snake-game');

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
        await sleep(40);
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

module.exports = FitnessLandscape;