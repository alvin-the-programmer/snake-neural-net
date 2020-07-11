const { 
  OUTPUT_NODE_MAP,
  GameOver,
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
      const state = game.getNeuralNetInputState();
      this.neuralNetwork.nodes.input.forEach((node, i) => inputs[node] = state[i]);
      const outputNode = this.neuralNetwork.getOutput(inputs);
      const direction = OUTPUT_NODE_MAP[outputNode];
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

    return game.foodScore;
  }

  async animate() {
    const game = new SnakeGame();

    while (true) {
      const inputs = {};
      const state = game.getNeuralNetInputState();
      this.neuralNetwork.nodes.input.forEach((node, i) => inputs[node] = state[i]);
      const outputNode = this.neuralNetwork.getOutput(inputs);
      const direction = OUTPUT_NODE_MAP[outputNode];
      game.input(direction);

      try {
        game.simulate();
        game.draw();
        await sleep(30);
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
      fitness: game.foodScore
    });
  }
}

module.exports = FitnessLandscape;