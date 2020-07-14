const { 
  OUTPUT_NODE_MAP,
  LOG_SPECIMEN,
  LOG_SPECIMEN_FITNESS_THRESHOLD,
  ANIMATION_FRAME_DELAY,
  GameOver
} = require('../constants');

const { sleep, uuidv4 } = require('../util');

const SnakeGame = require('../snake-game');

const fs = require('fs');

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

    if (LOG_SPECIMEN && game.foodScore >= LOG_SPECIMEN_FITNESS_THRESHOLD) {
      const speciesId = `./logs/new-${game.foodScore}-${uuidv4()}.json`;
      const neuralNetData = JSON.stringify(this.neuralNetwork);
      fs.writeFile(speciesId, neuralNetData, {flag: 'w'}, (err) => {
        if (err) throw err;
      });
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

    console.log({ 
      nodes: this.neuralNetwork.nodes,
      connections: this.neuralNetwork.connections,
      fitness: game.foodScore
    });
  }
}

module.exports = FitnessLandscape;