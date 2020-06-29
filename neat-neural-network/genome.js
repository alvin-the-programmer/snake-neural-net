const NUM_INPUTS = 20 * 20;
const NUM_OUTPUTS = 4;

const getRandom = (min, max) => Math.random() * (max - min) + min;
const getRandomElement = array => array[Math.floor(getRandom(0, array.length))];

// TODO prevent generation innovation duplicate

class Genome {
  static innovationNumber = 0;
  
  constructor({ numInputs, numOutputs }) {
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
    const match = genomeA.inn
    console.log(genomeA.getInnovations().join(','));
    console.log(genomeB.getInnovations().join(','));
  }


  getNodes() {
    return Object.values(this.nodes).reduce((all , array) => [ ...all, ...array ]);
  }

  getExistingEdges() {
    return Object.keys(this.connections);
  }

  getInnovations() {
    return Object.values(this.connections)
      .map(connection => connection.innovation).sort((a, b) => a - b);
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


// const g = new Genome({ numInputs: NUM_INPUTS, numOutputs: NUM_OUTPUTS });

const g1 = new Genome({ numInputs: 2, numOutputs: 2 });
g1.addConnectionMutation();
g1.addConnectionMutation();
g1.addNodeMutation();
console.log(g1);

const g2 = new Genome({ numInputs: 2, numOutputs: 2 });
g2.addConnectionMutation();
g2.addConnectionMutation();
g2.addNodeMutation();
console.log(g2);

console.log(g1.getInnovations());
console.log(g2.getInnovations());


// Genome.crossover({genomeA: g1, genomeB: g2});