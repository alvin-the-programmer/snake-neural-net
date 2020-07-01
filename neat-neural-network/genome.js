const { 
  EXCESS_COEFFICIENT,
  DISJOINT_COEFFICIENT,
  WEIGHT_DIFF_COEFFICIENT,
  getRandom,
  getRandomElement
} = require('./constants');

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
    this.innovations = {};

    for (let i = 1; i <= numInputs; i++) this.nodes.input.push(i);

    for (let i = 1; i <= numOutputs; i++) this.nodes.output.push(numInputs + i);

    this.nodes.input.forEach((nodeA) => {
      this.nodes.output.forEach((nodeB) => {
        const edgeId = Genome.edgeId(nodeA, nodeB);
        const innovation = Genome.upgradeInnovationNumber();
        this.connections[edgeId] = {
          innovation,
          weight: getRandom(-1, 1),
          enabled: true,
        };
        this.innovations[innovation] = edgeId;
      });
    });
  }

  static crossover(organismA, organismB) {
    const { genome: genomeA, fitness: fitnessA } = organismA;
    const { genome: genomeB, fitness: fitnessB } = organismB;
    const comparison = Genome.compareInnovations(genomeA, genomeB);
    const inheritanceA = [];
    const inheritanceB = [];

    comparison.intersection.forEach(gene => {
      getRandomElement([true, false]) ? inheritanceA.push(gene) : inheritanceB.push(gene);
    });

    if (fitnessA > fitnessB) {
      inheritanceA.push(...comparison.disjointA, ...comparison.excessA);
    } else {
      inheritanceB.push(...comparison.disjointB, ...comparison.excessB);
    }

    const offspringGenome = Genome.makeNodeUnionOffspring(genomeA, genomeB);

    inheritanceA.forEach(gene => {
      const edge = genomeA.innovations[gene];
      offspringGenome.innovations[gene] = edge;
      offspringGenome.connections[edge] = { ...genomeA.connections[edge] };
    });

    inheritanceB.forEach(gene => {
      const edge = genomeB.innovations[gene];
      offspringGenome.innovations[gene] = edge;
      offspringGenome.connections[edge] = { ...genomeB.connections[edge] };
    });

    return offspringGenome;
  }

  static delta(genomeA, genomeB) {
    const { intersection, disjointA, disjointB, excessA, excessB } = Genome.compareInnovations(genomeA, genomeB);
    const numberExcess = excessA.length + excessB.length;
    const numberDisjoint = disjointA.length + disjointB.length;

    // intersection weighted avg diff
    const weightDiffTotal = intersection.reduce((sum, gene) => {
      const edgeA = genomeA.innovations[gene];
      const edgeB = genomeB.innovations[gene];
      const weightA = genomeA.connections[edgeA].weight;
      const weightB = genomeB.connections[edgeB].weight;
      return sum + Math.abs(weightA - weightB);
    }, 0);
    const averageWeightDiff = weightDiffTotal / intersection.length;

    const normalizeFactor= Math.max(genomeA.size(), genomeB.size());

    const excessTerm = (EXCESS_COEFFICIENT * numberExcess) / normalizeFactor;
    const disjointTerm = (DISJOINT_COEFFICIENT * numberDisjoint) / normalizeFactor;
    const weightTerm = (WEIGHT_DIFF_COEFFICIENT * averageWeightDiff);
    return excessTerm + disjointTerm + weightTerm;
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

    return { 
      intersection: Array.from(intersection),
      disjointA: Array.from(disjointA),
      disjointB: Array.from(disjointB),
      excessA: Array.from(excessA),
      excessB: Array.from(excessB) 
    };
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
    const hiddenUnion = new Set([ ...genomeA.nodes.hidden, ...genomeB.nodes.hidden ]);
    const offspring = new Genome();

    offspring.nodes = {
      input: genomeA.nodes.input.slice(),
      hidden: [...hiddenUnion ],
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

  size() {
    return Object.keys(this.connections).length;
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

    const innovation = Genome.upgradeInnovationNumber();
    this.connections[newEdgeId] = {
      innovation,
      weight: getRandom(-1, 1),
      enabled: true,
    };
    this.innovations[innovation] = newEdgeId;
  }

  addNodeMutation() {
    const oldEdgeId = getRandomElement(this.getExistingEdges());
    const [src, dst] = oldEdgeId.split(",");
    const newNode = this.getNodes().length + 1;
    this.nodes.hidden.push(newNode);
    const srcToNewEdgeId = Genome.edgeId(src, newNode);
    const newToDstEdgeId = Genome.edgeId(newNode, dst);

    this.connections[oldEdgeId].enabled = false;

    const innovation1 = Genome.upgradeInnovationNumber();
    this.connections[srcToNewEdgeId] = {
      innovation: innovation1,
      weight: 1,
      enabled: true,
    };
    this.innovations[innovation1] = srcToNewEdgeId;

    const innovation2 = Genome.upgradeInnovationNumber();
    this.connections[newToDstEdgeId] = {
      innovation: innovation2,
      weight: this.connections[oldEdgeId].weight,
      enabled: true,
    };
    this.innovations[innovation2] = newToDstEdgeId;
  }
}

const g1 = new Genome({ numInputs: 3, numOutputs: 1 });
g1.nodes = {
  input: [1, 2, 3],
  hidden: [5],
  output: [4],
};
g1.connections = {
  "1,4": { innovation: 1, weight: -0.3, enabled: true },
  "2,4": { innovation: 2, weight: 0.2, enabled: true },
  "3,4": { innovation: 3, weight: -0.1, enabled: true },
  "2,5": { innovation: 4, weight: 0.1, enabled: true },
  "5,4": { innovation: 5, weight: -0.8, enabled: true },
  "1,5": { innovation: 8, weight: 0.5, enabled: true },
};
g1.innovations = {
  1: "1,4",
  2: "2,4",
  3: "3,4",
  4: "2,5",
  5: "5,4",
  8: "1,5",
};

const g2 = new Genome({ numInputs: 2, numOutputs: 2 });
g2.nodes = {
  input: [1, 2, 3],
  hidden: [5, 6],
  output: [4],
};
g2.connections = {
  "1,4": { innovation: 1, weight: 0.6, enabled: true },
  "2,4": { innovation: 2, weight: -0.9, enabled: true },
  "3,4": { innovation: 3, weight: 0.1, enabled: true },
  "2,5": { innovation: 4, weight: -0.3, enabled: true },
  "5,4": { innovation: 5, weight: 0.7, enabled: true },
  "5,6": { innovation: 6, weight: -0.8, enabled: true },
  "6,4": { innovation: 7, weight: 0.1, enabled: true },
  "3,5": { innovation: 9, weight: -0.2, enabled: true },
  "1,6": { innovation: 10, weight: 0.4, enabled: true },
};
g2.innovations = {
  1: "1,4",
  2: "2,4",
  3: "3,4",
  4: "2,5",
  5: "5,4",
  6: "5,6",
  7: "6,4",
  9: "3,5",
  10: "1,6",
};

// console.log(g1);
// console.log(g2);
// const child = Genome.crossover({ genome: g1, fitness: 12 }, { genome: g2, fitness: 13 });
// console.log(Genome.delta(g1,g2));
// E = 2
// D = 3
// W = .82

module.exports = Genome;