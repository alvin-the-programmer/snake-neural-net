const { 
  NUM_INPUTS, 
  NUM_OUTPUTS, 
  POPULATION_SIZE,
  SPECIES_EXTINCTION_THRESHOLD,
} = require('../constants');

const Genome = require('./genome');
const Species = require('./species');

class Generation {
  static count = 0;

  constructor() {
    this.species = [];
    this.number = Generation.count++;
  }

  static makeInitialPopulation(size) {
    const primordialGenome = new Genome({ numInputs: NUM_INPUTS, numOutputs: NUM_OUTPUTS });
    const generationZero = new Generation();

    Genome.makeClones(primordialGenome, size).forEach(genome => {
      for (const edge in genome.connections)
        genome.randomlyAssignWeight(edge);

      let compatibleSpeciesFound = false;
      for (const species of generationZero.species) {
        if (species.isCompatible(genome)) {
          compatibleSpeciesFound = true;
          species.members.add(genome);
          break;
        }
      }

      if (!compatibleSpeciesFound)
        generationZero.species.push(new Species(genome));
    });
    
    return generationZero;
  }

  evolve() {
    const nextGeneration = new Generation();

    this.species.forEach(prevSpecies => {
      const nextSpecies = new Species(prevSpecies.getRandomMember());
      nextGeneration.species.push(nextSpecies);
    });

    const populationFitness = this.species.reduce((sum, species) => sum + species.getTotalFitness(), 0);

    const offspringDistribution = this.species.map(species => {
      const numOffspring = Math.round(POPULATION_SIZE * (species.getTotalFitness() / populationFitness));
      return numOffspring < SPECIES_EXTINCTION_THRESHOLD ? 0 : numOffspring;
    });

    const error = POPULATION_SIZE - offspringDistribution.reduce((sum, n) => sum + n);
    const delta = error > 0 ? +1 : -1;
    let errorMagnitude = Math.abs(error);
    for(let i = 0; errorMagnitude > 0; i++) {
      const speciesIdx = i % offspringDistribution.length;
      if (offspringDistribution[speciesIdx] !== 0) {
        offspringDistribution[speciesIdx] += delta;
        errorMagnitude--;
      }
    }

    console.log(offspringDistribution.reduce((a, b) => a + b)); // TODO

    return nextGeneration;
  }
}

const g0 = Generation.makeInitialPopulation(POPULATION_SIZE);

console.log(g0.species.length);
g0.evolve();
