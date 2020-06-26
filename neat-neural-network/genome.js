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
        Genome.innovations[edgeId] = Genome.getNextInnovationNumber();
        this.connections[edgeId] = { weight: getRandom(-2, 2), enabled:  true };
      });
    });
  }

  static edgeId(node1, node2) {
    return node1 + ',' + node2;
  }

  static getNextInnovationNumber() {
    return ++Genome.innovationNumber;
  }

  getNodes() {
    return Object.values(this.nodes).reduce((all , array) => [ ...all, ...array ]);
  }

  addConnectionMutation() {
    const newEdgeId = getRandomElement(this.getNewEdgeCandidates());

    if (!newEdgeId)
      return null;

    this.connections[newEdgeId] = { weight: getRandom(-2, 2), enabled: true };
    
    if (!(newEdgeId in Genome.innovations))
      Genome.innovations[newEdgeId] = Genome.getNextInnovationNumber();
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

  addNodeMutation() {
    // TODO
  }
}


const g = new Genome({ numInputs: NUM_INPUTS, numOutputs: NUM_OUTPUTS });
// console.log(Object.keys(g.connections).length);
// console.log(g.getNewEdgeCandidates());
// console.log(Genome.innovations);
// console.log(Genome.innovationNumber);

console.log(getRandomElement([2, 3]));