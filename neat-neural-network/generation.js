const { NUM_INPUTS, NUM_OUTPUTS, POPULATION_SIZE } = require('../constants');
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
}

const g0 = Generation.makeInitialPopulation(POPULATION_SIZE);
console.log(g0.species.length);
console.log(g0.species.reduce((sum, species) => sum + species.size(), 0));
