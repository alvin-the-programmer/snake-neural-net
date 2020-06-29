const NUM_INPUTS = 20 * 20;
const NUM_OUTPUTS = 4;

const getRandom = (min, max) => Math.random() * (max - min) + min;
const getRandomElement = array => array[Math.floor(getRandom(0, array.length))];

// TODO prevent generation innovation duplicate

class Genome {
  static innovationNumber = 0;

  constructor(nonHiddenLayers = { numInputs: 0, numOutputs: 0 }) {
    const { numInputs, numOutputs } = nonHiddenLayers;

    this.nodes = {
      input: [],
      output: [],
      hidden: []
    };

    this.connections = {};

    for (let i = 1; i <= numInputs; i++)
      this.nodes.input.push(i);

    for (let i = 1; i <= numOutputs; i++)
      this.nodes.output.push(numInputs + i);

    this.nodes.input.forEach(nodeA => {
      this.nodes.output.forEach(nodeB => {
        const edgeId = Genome.edgeId(nodeA, nodeB);
        this.connections[edgeId] = { 
          innovation: Genome.upgradeInnovationNumber(),
          weight: getRandom(-1, 1), 
          enabled:  true
        };
      });
    });
  }

  static edgeId(node1, node2) {
    return node1 + ',' + node2;
  }

  static upgradeInnovationNumber() {
    return ++Genome.innovationNumber;
  }

  static crossover({ genomeA, genomeB, fitnessA, fitnessB }) {
    // TODO
  }

  static compareInnovations(genomeA, genomeB) {
    const setA = new Set(genomeA.getInnovations());
    const setB = new Set(genomeB.getInnovations());
    const rangeA = { min: Math.min(...setA), max: Math.max(...setA) };
    const rangeB = { min: Math.min(...setB), max: Math.max(...setB) };

    const neutralMatch = new Set();
    const disjointA = new Set();
    const disjointB = new Set();
    const excessA = new Set();
    const excessB = new Set();

    for (let innovation of setA) {
      if (setB.has(innovation)) {
        neutralMatch.add(innovation);
      } else if (rangeB.min < innovation && innovation < rangeB.max){
        disjointA.add(innovation);
      } else {
        excessA.add(innovation);
      }
    }

    for (let innovation of setB) {
      if (setA.has(innovation)) {
        neutralMatch.add(innovation);
      } else if (rangeA.min < innovation && innovation < rangeA.max){
        disjointB.add(innovation);
      } else {
        excessB.add(innovation);
      }
    }

    return { neutralMatch, disjointA, disjointB, excessA, excessB };
  }

  static clone(parentGenome, numClones) {
    let clones = [];

    for (let i = 0; i < numClones; i++) {
      const childGenome = new Genome();
  
      for (let nodeType in parentGenome.nodes) 
        childGenome.nodes[nodeType] = parentGenome.nodes[nodeType].slice();
  
      for (let edge in parentGenome.connections)
        childGenome.connections[edge] = { ...parentGenome.connections[edge] };
  
      clones.push(childGenome);
    }

    return clones;
  }

  getNodes() {
    return Object.values(this.nodes).reduce((all , array) => [ ...all, ...array ]);
  }

  getExistingEdges() {
    return Object.keys(this.connections);
  }

  getInnovations() {
    return Object.values(this.connections).map(connection => connection.innovation);
  }

  getNewEdgeCandidates() {
    const allNodes = this.getNodes();
    const candidates = [];

    allNodes.forEach(nodeA => {
      allNodes.forEach(nodeB => {
        const edgeId = Genome.edgeId(nodeA, nodeB);
        if (nodeA !== nodeB && !(edgeId in this.connections))
          candidates.push(edgeId);
      });
    });

    return candidates;
  }

  addConnectionMutation() {
    const newEdgeId = getRandomElement(this.getNewEdgeCandidates());

    if (!newEdgeId)
      return null;

    this.connections[newEdgeId] = { 
      innovation: Genome.upgradeInnovationNumber(),
      weight: getRandom(-1, 1),
      enabled: true 
    };
  }

  addNodeMutation() {
    const oldEdgeId = getRandomElement(this.getExistingEdges());
    const [ src, dst ] = oldEdgeId.split(',');
    const newNode = this.getNodes().length + 1;
    this.nodes.hidden.push(newNode);
    const srcToNewEdgeId = Genome.edgeId(src, newNode);
    const newToDstEdgeId = Genome.edgeId(newNode, dst);

    this.connections[oldEdgeId].enabled = false;

    this.connections[srcToNewEdgeId] = { 
      innovation: Genome.upgradeInnovationNumber(),
      weight: 1, 
      enabled: true 
    };

    this.connections[newToDstEdgeId] = { 
      innovation: Genome.upgradeInnovationNumber(),
      weight: this.connections[oldEdgeId].weight, 
      enabled: true 
    };
  }
}

const g1 = new Genome({ numInputs: 2, numOutputs: 2 });
g1.connections = {
  'g1a': { innovation: 1 },
  'g1b': { innovation: 2 },
  'g1c': { innovation: 3 },
  'g1d': { innovation: 4 },
  'g1e': { innovation: 5 },
  'g1f': { innovation: 8 },
}


const g2 = new Genome({ numInputs: 2, numOutputs: 2 });
g2.connections = {
  'g2a': { innovation: 1 },
  'g2b': { innovation: 2 },
  'g2c': { innovation: 3 },
  'g2d': { innovation: 4 },
  'g2e': { innovation: 5 },
  'g2f': { innovation: 6 },
  'g2g': { innovation: 7 },
  'g2h': { innovation: 9 },
  'g2i': { innovation: 10 },

}


// console.log(g1);
// console.log(g2);
console.log(Genome.compareInnovations(g1, g2));
