const { 
  SPECIES_COMPATIBILITY_THRESHOLD, 
  CROSSOVER_RATE,
  MUTATION_RATE,
  getRandomElement, 
  randomChance 
} = require('../constants');

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
    return getRandomElement(Array.from(this.members));
  }

  size() {
    return this.members.size;
  }

  eradicateMembers() {
    this.members = new Set();
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
      .sort((a, b) => a.getFitness() - b.getFitness())
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

  getRandomSample(sampleSize) {
    if (sampleSize > this.size())
      throw new Error('not enough species members to sample');

    const sample = [];
    const pool = new Set(this.members);
    while (sample.length < sampleSize) {
      const randomMember = getRandomElement(Array.from(pool));
      sample.push(randomMember);
      pool.delete(randomMember);
    }
    return sample;
  }

  reproduce(numOffspring) {
    if (numOffspring === 0)
      return [];

    const offspring = [];

    while (offspring.length < numOffspring - 1) {
      if (randomChance(CROSSOVER_RATE) && this.size() >= 2) {
        const [ parentA, parentB ] = this.getRandomSample(2);
        const child = Genome.crossover(parentA, parentB);
        offspring.push(child);
      } else {
        const [ parent ] = this.getRandomSample(1);
        const [ child ] = Genome.makeClones(parent, 1);
        offspring.push(child);
      }
    }

    offspring.forEach(genome => {
      if (randomChance(MUTATION_RATE.WEIGHT))
        genome.modifyWeightMutation();

      if (randomChance(MUTATION_RATE.NEW_NODE))
        genome.addNodeMutation();

      if (randomChance(MUTATION_RATE.NEW_CONNECTION))
        genome.addConnectionMutation();
    });

    const [ champion ] = Genome.makeClones(this.getFittestMember(), 1);
    offspring.push(champion);

    return offspring;
  }
}

module.exports = Species;