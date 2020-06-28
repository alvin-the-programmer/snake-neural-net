const NUM_INPUTS = 20 * 20;
const NUM_OUTPUTS = 4;

const getRandom = (min, max) => Math.random() * (max - min) + min;
const getRandomElement = array => array[Math.floor(getRandom(0, array.length))];

class Genome {
  static innovationNumber = 0;
  static innovations = {};

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
        Genome.innovations[edgeId] = Genome.upgradeInnovationNumber();
        this.connections[edgeId] = { weight: getRandom(-1, 1), enabled:  true };
      });
    });
  }

  static edgeId(node1, node2) {
    return node1 + ',' + node2;
  }

  static upgradeInnovationNumber() {
    return ++Genome.innovationNumber;
  }

  getNodes() {
    return Object.values(this.nodes).reduce((all , array) => [ ...all, ...array ]);
  }

  getExistingEdges() {
    return Object.keys(this.connections);
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

    this.connections[newEdgeId] = { weight: getRandom(-1, 1), enabled: true };

    if (!(newEdgeId in Genome.innovations))
      Genome.innovations[newEdgeId] = Genome.upgradeInnovationNumber();
  }

  addNodeMutation() {
    const oldEdgeId = getRandomElement(this.getExistingEdges());
    const [ src, dst ] = oldEdgeId.split(',');
    const newNode = this.getNodes().length + 1;
    this.nodes.hidden.push(newNode);
    const srcToNewEdgeId = Genome.edgeId(src, newNode);
    const newToDstEdgeId = Genome.edgeId(newNode, dst);
    Genome.innovations[srcToNewEdgeId] = Genome.upgradeInnovationNumber();
    Genome.innovations[newToDstEdgeId] = Genome.upgradeInnovationNumber();
    this.connections[srcToNewEdgeId] = { weight: 1, enabled: true };
    this.connections[newToDstEdgeId] = { weight: this.connections[oldEdgeId].weight, enabled: true };
    this.connections[oldEdgeId].enabled = false;
  }
}


// const g = new Genome({ numInputs: NUM_INPUTS, numOutputs: NUM_OUTPUTS });

const g = new Genome({ numInputs: 2, numOutputs: 2 });
console.log(g);
console.log(Genome.innovations);
g.addConnectionMutation();
console.log('------ mutate connection');
console.log(g);
console.log(Genome.innovations);
g.addNodeMutation();
console.log('------ mutate node');
console.log(g);
console.log(Genome.innovations);