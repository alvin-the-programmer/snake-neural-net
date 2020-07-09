const { 
  sigmoid,
  modifiedSigmoid
} = require('../constants');

// TODO what happens if there is a cycle?

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

  activate(inputActivations) {
    const readyToActivate = [];
    const activation = {};
    const inactiveIngress = {};

    for (let node in this.inputMap)
      inactiveIngress[node] = new Set(this.inputMap[node]);

    const exploreNode = node => {
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

    return maxNode;
  }
}

// console.log(NeuralNetwork.makeRandomSimpleNetwork(4, 4));

module.exports = NeuralNetwork;