const { sigmoid } = require('../constants');

// TODO what happens if there is a cycle?

class NeuralNetwork {
  constructor ({ input, hidden, output }, connections) {
    this.nodes = {
      input,
      hidden,
      output
    };

    this.connections = connections;
    this.inputMap = {};
    this.outputMap = {};

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

  activate(inputActivations) {
    const readyToActivate = [];
    const activation = {};
    const inactiveIngress = {};

    for (let node in this.inputMap)
      inactiveIngress[node] = new Set(this.inputMap[node]);

    const exploreNode = node => {
      console.log(node);
      for (let dstNode of this.outputMap[node]) {
        inactiveIngress[dstNode].delete(node);
        if (inactiveIngress[dstNode].size === 0)
          readyToActivate.push(dstNode);
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
        activation[node] = sigmoid(weightedSum);
      }

      exploreNode(node);
    }
    
    return activation;
  }
}

const nodes = {
  input: [1, 2, 3],
  hidden: [5],
  output: [4],
};

const connections = {
  "1,4": { weight: -0.3, enabled: true },
  "2,4": { weight: 0.2, enabled: true },
  "3,4": { weight: -0.1, enabled: true },
  "2,5": { weight: 0.1, enabled: true },
  "5,4": { weight: -0.8, enabled: true },
  "1,5": { weight: 0.5, enabled: true },
};

const net = new NeuralNetwork(nodes, connections);

console.log(net.activate({1: 3, 2: 3, 3: 5}));
