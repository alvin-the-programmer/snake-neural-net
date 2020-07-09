const { 
  EXCESS_COEFFICIENT,
  DISJOINT_COEFFICIENT,
  WEIGHT_DIFF_COEFFICIENT,
  PERTURB_WEIGHT_DELTA,
  INHERIT_DISABLED_GENE_RATE,
  getRandom,
  getRandomElement,
  randomChance,
} = require('../constants');

const NeuralNetwork = require('./neural-network');
const FitnessLandscape = require('../fitness-landscape');

// TODO track duplicate innovation on generation
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
    this.fitness = null;

    for (let i = 1; i <= numInputs; i++) this.nodes.input.push(i);

    for (let i = 1; i <= numOutputs; i++) this.nodes.output.push(numInputs + i);

    this.nodes.input.forEach((nodeA) => {
      this.nodes.output.forEach((nodeB) => {
        const edgeId = Genome.edgeId(nodeA, nodeB);
        const innovation = Genome.upgradeInnovationNumber();
        this.connections[edgeId] = {
          innovation,
          weight: 0,
          enabled: true,
        };
        this.innovations[innovation] = edgeId;
      });
    });
  }

  static crossover(genomeA, genomeB) {
    const fitnessA = genomeA.getFitness();
    const fitnessB = genomeB.getFitness();
    const comparison = Genome.compareInnovations(genomeA, genomeB);
    const inheritanceA = [];
    const inheritanceB = [];

    comparison.intersection.forEach(gene => {
      randomChance(0.50) ? inheritanceA.push(gene) : inheritanceB.push(gene);
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

      if (genomeA.connections[edge].enabled === false && randomChance(1 - INHERIT_DISABLED_GENE_RATE))
        offspringGenome.connections[edge].enabled = true;
    });

    inheritanceB.forEach(gene => {
      const edge = genomeB.innovations[gene];
      offspringGenome.innovations[gene] = edge;
      offspringGenome.connections[edge] = { ...genomeB.connections[edge] };

      if (genomeB.connections[edge].enabled === false && randomChance(1 - INHERIT_DISABLED_GENE_RATE))
        offspringGenome.connections[edge].enabled = true;
    });

    return offspringGenome;
  }

  static delta(genomeA, genomeB) {
    const { intersection, disjointA, disjointB, excessA, excessB } = Genome.compareInnovations(genomeA, genomeB);
    const numberExcess = excessA.length + excessB.length;
    const numberDisjoint = disjointA.length + disjointB.length;

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

  static makeClones(parentGenome, numClones) {
    let clones = [];

    for (let i = 0; i < numClones; i++) {
      const childGenome = new Genome();

      for (let nodeType in parentGenome.nodes)
        childGenome.nodes[nodeType] = parentGenome.nodes[nodeType].slice();

      for (let edge in parentGenome.connections)
        childGenome.connections[edge] = { ...parentGenome.connections[edge] };

      childGenome.innovations = { ...parentGenome.innovations };

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

  makeNeuralNetwork() {
    return new NeuralNetwork(this.nodes, this.connections);
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

  getFitness() {
    if (!this.fitness) {
      const fitnessLandscape = new FitnessLandscape(this.makeNeuralNetwork());
      this.fitness = fitnessLandscape.calculateFitness();
    }

    return this.fitness;
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
    this.fitness = null;
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
    this.fitness = null;
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

  randomlyPerturbWeight(edge) {
    this.fitness = null;
    this.connections[edge].weight += getRandom(-PERTURB_WEIGHT_DELTA, PERTURB_WEIGHT_DELTA);
  }

  randomlyAssignWeight(edge) {
    this.fitness = null;
    this.connections[edge].weight = getRandom(-1, 1);
  }
}

module.exports = Genome;