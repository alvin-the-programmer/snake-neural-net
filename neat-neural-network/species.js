const { SPECIES_COMPATIBILITY_THRESHOLD, getRandomElement } = require('./constants');
const Genome = require('./genome');

class Species {
  constructor(protoGenome) {
    this.representative = protoGenome;
    this.members = new Set([ protoGenome ]);
  }

  isCompatible(genome) {
    return Genome.delta(this.representative, genome) <= SPECIES_COMPATIBILITY_THRESHOLD;
  }

  addMember(genome) {
    this.members.push(genome);
  }

  getRandomMember() {
    return getRandomElement(this.members);
  }

  size() {
    return this.members.size;
  }

  getAdjustedFitness(genome) {
    if (!this.members.has(genome))
      throw new Error('genome is not a member of this species');

    return genome.getFitness() / this.size();
  }
}

module.exports = Species;