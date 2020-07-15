// ANIMATION_FRAME_DELAY,
// OUTPUT_NODE_MAP
// GameOver
// sleep
const SnakeGame = require('../snake-game');

class FitnessLandscape {
  constructor(neuralNetwork) {
    this.neuralNetwork = neuralNetwork;
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
        await sleep(ANIMATION_FRAME_DELAY);
      } catch (error) {
        if (error instanceof GameOver) {
          console.log('GAME OVER!');
          break;
        } else {
          throw error;
        }
      }
    } 
  }
}

module.exports = FitnessLandscape;