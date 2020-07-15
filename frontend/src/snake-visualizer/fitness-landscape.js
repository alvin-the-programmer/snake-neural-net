import { 
  OUTPUT_NODE_MAP, 
  modifiedSigmoid 
} from './util';

import SnakeGame from './game';

class FitnessLandscape {
  constructor(network) {
    this.neuralNetwork = new NeuralNetwork(network.nodes, network.connections);
    this.game = new SnakeGame();
  }

  // async animate() {
  //   const game = new SnakeGame();

  //   while (true) {
  //     const inputs = {};
  //     const state = game.getNeuralNetInputState();
  //     this.neuralNetwork.nodes.input.forEach((node, i) => inputs[node] = state[i]);
  //     const outputNode = this.neuralNetwork.getOutput(inputs);
  //     const direction = OUTPUT_NODE_MAP[outputNode];
  //     game.input(direction);

  //     try {
  //       game.simulate();
  //       game.draw();
  //       await sleep(ANIMATION_FRAME_DELAY);
  //     } catch (error) {
  //       if (error instanceof GameOver) {
  //         console.log('GAME OVER!');
  //         break;
  //       } else {
  //         throw error;
  //       }
  //     }
  //   } 
  // }

  step() {
    const inputs = {};
    const state = this.game.getNeuralNetInputState();
    this.neuralNetwork.nodes.input.forEach((node, i) => inputs[node] = state[i]);
    const { output, activations } = this.neuralNetwork.getOutput(inputs);
    const direction = OUTPUT_NODE_MAP[output];
    this.game.input(direction);
    this.game.simulate();
    return {
      grid: this.game.draw(),
      activations
    };
  }
}

class NeuralNetwork {
  constructor ({ input, hidden, output }, connections) {
    this.nodes = {
      input: [...input],
      hidden: [...hidden],
      output: [...output]
    };

    this.connections = {};
    this.inputMap = {};
    this.outputMap = {};

    for (const edge in connections) {
      const connection = connections[edge];
      this.connections[edge] = { weight: connection.weight, enabled: connection.enabled }; 
    }

    [ ...input, ...hidden, ...output ].forEach(node => {
      this.inputMap[node] = new Set();
      this.outputMap[node] = new Set();
    });

    for (let node of input)
      this.inputMap[node] = new Set();

    for (let edge in connections) {
      const [ src, dst ] = edge.split(',');
      this.inputMap[dst].add(src);
    }

    for (let edge in connections) {
      const [ src, dst ] = edge.split(',');
      this.outputMap[src].add(dst);
    }
  }

  static fromJSON(data) {
    const { nodes, connections } = JSON.parse(data);
    return new NeuralNetwork(nodes, connections);
  }

  activate(inputActivations) {
    const readyToActivate = [];
    const activation = {};
    const inactiveIngress = {};

    for (let node in this.inputMap)
      inactiveIngress[node] = new Set(this.inputMap[node]);

    const exploreNode = node => {
      for (let dstNode of this.outputMap[node]) {
        inactiveIngress[dstNode].delete(node);
        if (inactiveIngress[dstNode].size === 0 && !(dstNode in activation)){
          readyToActivate.push(dstNode);
        }
      }
    };
    
    for (let node in inputActivations) {
      readyToActivate.push(node);
    }

    while (readyToActivate.length > 0) {
      const node = readyToActivate.pop();
      const inputNodes = this.inputMap[node];
      let weightedSum = 0;
      for (const inputNode of inputNodes) {
        const connection = this.connections[inputNode + ',' + node];
        if (connection.enabled)
          weightedSum += activation[inputNode] * connection.weight;
      }

      if (node in inputActivations) {
        activation[node] = inputActivations[node];
      } else {
        activation[node] = modifiedSigmoid(weightedSum);
      }

      exploreNode(node);
    }
    
    return activation;
  }

  getOutput(inputs) {
    const activationLevel = this.activate(inputs);
    let maxNode = null;

    this.nodes.output.forEach(node => {
      if (activationLevel[node] > activationLevel[maxNode] || maxNode === null)
        maxNode = node;
    });

    return {
      activations: activationLevel,
      output: maxNode
    };
  }
}

export default FitnessLandscape;