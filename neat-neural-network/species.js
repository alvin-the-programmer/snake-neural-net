const { SPECIES_COMPATIBILITY_THRESHOLD, getRandomElement } = require('../constants');
const Genome = require('./genome');

class Species {
  constructor(protoGenome) {
    this.representative = protoGenome;
    this.members = new Set([ protoGenome ]);
  }

  isCompatible(genome) {
    return Genome.delta(this.representative, genome) <= SPECIES_COMPATIBILITY_THRESHOLD;
  }

  isExtinct() {
    return this.size() === 0;
  }

  addMember(genome) {
    this.members.push(genome);
  }

  setRandomRepresentative() {
    this.representative = this.getRandomMember();
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

  getTotalFitness() {
    let totalFitness = 0;

    for (let genome of this.members)
      totalFitness += this.getAdjustedFitness(genome);

    return totalFitness;
  }

  cullMembers(cullRate) {
    const numToKill = Math.floor(this.size() * cullRate);

    const weakMembers = Array.from(this.members)
      .sort((a, b) => a.getFitness() - b.getFitness()) // this will be horribly slow
      .slice(0, numToKill);
  
    weakMembers.forEach(weakling => this.members.delete(weakling));
  }

  getFittestMember() {
    let fittest = null;
    for (const member of this.members) {
      if (fittest === null || member.getFitness() > fittest.getFitness())
        fittest = member;
    }
    return fittest;
  }

  reproduce(numOffspring) {
    if (numOffspring === 0)
      return [];

    const offspring = [ this.getFittestMember() ];
    numOffspring--;

  
    // console.log(offspring[0]);
  }
}

module.exports = Species;