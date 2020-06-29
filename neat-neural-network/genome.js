const NUM_INPUTS = 20 * 20;
const NUM_OUTPUTS = 4;

const getRandom = (min, max) => Math.random() * (max - min) + min;
const getRandomElement = (array) => array[Math.floor(getRandom(0, array.length))];

// TODO prevent generation innovation duplicate

class Genome {
  static innovationNumber = 0;

  constructor(nonHiddenLayers = { numInputs: 0, numOutputs: 0 }) {
    const { numInputs, numOutputs } = nonHiddenLayers;

    this.nodes = {
      input: [],
      output: [],
      hidden: [],
    };

    this.connections = {};

    for (let i = 1; i <= numInputs; i++) this.nodes.input.push(i);

    for (let i = 1; i <= numOutputs; i++) this.nodes.output.push(numInputs + i);

    this.nodes.input.forEach((nodeA) => {
      this.nodes.output.forEach((nodeB) => {
        const edgeId = Genome.edgeId(nodeA, nodeB);
        this.connections[edgeId] = {
          innovation: Genome.upgradeInnovationNumber(),
          weight: getRandom(-1, 1),
          enabled: true,
        };
      });
    });
  }

  static crossover(organismA, organismB) {
    const { genome: genomeA, fitness: fitnessA } = organismA;
    const { genome: genomeB, fitness: fitnessB } = organismB;
    const offspring = new Genome();
    const comparedInnovations = Genome.compareInnovations(genomeA, genomeB);
  }

  static compareInnovations(genomeA, genomeB) {
    const setA = new Set(genomeA.getInnovations());
    const setB = new Set(genomeB.getInnovations());
    const rangeA = { min: Math.min(...setA), max: Math.max(...setA) };
    const rangeB = { min: Math.min(...setB), max: Math.max(...setB) };

    const intersection = new Set();
    const disjointA = new Set();
    const disjointB = new Set();
    const excessA = new Set();
    const excessB = new Set();

    for (let innovation of setA) {
      if (setB.has(innovation)) {
        intersection.add(innovation);
      } else if (rangeB.min < innovation && innovation < rangeB.max) {
        disjointA.add(innovation);
      } else {
        excessA.add(innovation);
      }
    }

    for (let innovation of setB) {
      if (setA.has(innovation)) {
        intersection.add(innovation);
      } else if (rangeA.min < innovation && innovation < rangeA.max) {
        disjointB.add(innovation);
      } else {
        excessB.add(innovation);
      }
    }

    return { intersection, disjointA, disjointB, excessA, excessB };
  }

  static makeClone(parentGenome, numClones) {
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

  static makeNodeUnionOffspring(genomeA, genomeB) {
    const hiddenUnion = new Set([...genomeA.nodes.hidden, ...genomeB.nodes.hidden]);
    const offspring = new Genome();
    
    offspring.nodes = {
      input: genomeA.nodes.input.slice(),
      hidden: [...hiddenUnion],
      output: genomeA.nodes.output.slice(),
    };

    return offspring;
  }

  static edgeId(node1, node2) {
    return node1 + "," + node2;
  }

  static upgradeInnovationNumber() {
    return ++Genome.innovationNumber;
  }

  getNodes() {
    return Object.values(this.nodes).reduce((all, array) => [...all, ...array]);
  }

  getExistingEdges() {
    return Object.keys(this.connections);
  }

  getInnovations() {
    return Object.values(this.connections).map((connection) => connection.innovation);
  }

  getNewEdgeCandidates() {
    const allNodes = this.getNodes();
    const candidates = [];

    allNodes.forEach((nodeA) => {
      allNodes.forEach((nodeB) => {
        const edgeId = Genome.edgeId(nodeA, nodeB);
        if (nodeA !== nodeB && !(edgeId in this.connections)) candidates.push(edgeId);
      });
    });

    return candidates;
  }

  addConnectionMutation() {
    const newEdgeId = getRandomElement(this.getNewEdgeCandidates());

    if (!newEdgeId) return null;

    this.connections[newEdgeId] = {
      innovation: Genome.upgradeInnovationNumber(),
      weight: getRandom(-1, 1),
      enabled: true,
    };
  }

  addNodeMutation() {
    const oldEdgeId = getRandomElement(this.getExistingEdges());
    const [src, dst] = oldEdgeId.split(",");
    const newNode = this.getNodes().length + 1;
    this.nodes.hidden.push(newNode);
    const srcToNewEdgeId = Genome.edgeId(src, newNode);
    const newToDstEdgeId = Genome.edgeId(newNode, dst);

    this.connections[oldEdgeId].enabled = false;

    this.connections[srcToNewEdgeId] = {
      innovation: Genome.upgradeInnovationNumber(),
      weight: 1,
      enabled: true,
    };

    this.connections[newToDstEdgeId] = {
      innovation: Genome.upgradeInnovationNumber(),
      weight: this.connections[oldEdgeId].weight,
      enabled: true,
    };
  }
}

const g1 = new Genome({ numInputs: 3, numOutputs: 1 });
g1.nodes = {
  input: [1, 2, 3],
  hidden: [5],
  output: [4],
};

g1.connections = {
  "1,4": { innovation: 1, weight: getRandom(-1, 1), enabled: true },
  "2,4": { innovation: 2, weight: getRandom(-1, 1), enabled: true },
  "3,4": { innovation: 3, weight: getRandom(-1, 1), enabled: true },
  "2,5": { innovation: 4, weight: getRandom(-1, 1), enabled: true },
  "5,4": { innovation: 5, weight: getRandom(-1, 1), enabled: true },
  "1,5": { innovation: 8, weight: getRandom(-1, 1), enabled: true },
};

const g2 = new Genome({ numInputs: 2, numOutputs: 2 });

g2.nodes = {
  input: [1, 2, 3],
  hidden: [5, 6],
  output: [4],
};

g2.connections = {
  "1,4": { innovation: 1, weight: getRandom(-1, 1), enabled: true },
  "2,4": { innovation: 2, weight: getRandom(-1, 1), enabled: true },
  "3,4": { innovation: 3, weight: getRandom(-1, 1), enabled: true },
  "2,5": { innovation: 4, weight: getRandom(-1, 1), enabled: true },
  "5,4": { innovation: 5, weight: getRandom(-1, 1), enabled: true },
  "5,6": { innovation: 6, weight: getRandom(-1, 1), enabled: true },
  "6,4": { innovation: 7, weight: getRandom(-1, 1), enabled: true },
  "3,5": { innovation: 9, weight: getRandom(-1, 1), enabled: true },
  "1,6": { innovation: 10, weight: getRandom(-1, 1), enabled: true },
};


console.log(g1);
console.log(g2);
console.log(Genome.compareInnovations(g1, g2));
console.log(Genome.makeNodeUnionOffspring(g1, g2));
