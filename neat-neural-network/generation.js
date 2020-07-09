const { 
  NUM_INPUTS, 
  NUM_OUTPUTS, 
  POPULATION_SIZE,
  SPECIES_EXTINCTION_THRESHOLD,
  SPECIES_CULL_RATE,
} = require('../constants');

const Genome = require('./genome');
const Species = require('./species');

class Generation {
  constructor() {
    this.species = [];
    this.genNumber = 0;
  }

  static makeInitialPopulation() {
    const primordialGenome = new Genome({ numInputs: NUM_INPUTS, numOutputs: NUM_OUTPUTS });
    return Genome.makeClones(primordialGenome, POPULATION_SIZE).map(genome => {
      for (const edge in genome.connections)
        genome.randomlyAssignWeight(edge);
      return genome;
    });
  }

  evolve() {
    if (this.genNumber === 0) {
      const initialPop = Generation.makeInitialPopulation();
      this.speciate(initialPop);
      this.genNumber++;
      return;
    }

    const offspringDistribution = this.calculateOffspringDistribution();

    this.species.forEach(species => {
      species.setRandomRepresentative();
      species.cullMembers(SPECIES_CULL_RATE);
      species.reproduce();
    });

    this.genNumber++;
  }

  speciate(genomes) {
    genomes.forEach(genome => {
      for (const edge in genome.connections)
        genome.randomlyAssignWeight(edge);

      let compatibleSpeciesFound = false;
      for (const species of this.species) {
        if (species.isCompatible(genome)) {
          compatibleSpeciesFound = true;
          species.members.add(genome);
          break;
        }
      }

      if (!compatibleSpeciesFound)
        this.species.push(new Species(genome));
    });
  }

  calculateOffspringDistribution() {
    const populationFitness = this.species.reduce((sum, species) => sum + species.getTotalFitness(), 0);

    const offspringDistribution = this.species.map(species => {
      const numOffspring = Math.round(POPULATION_SIZE * (species.getTotalFitness() / populationFitness));
      return numOffspring < SPECIES_EXTINCTION_THRESHOLD ? 0 : numOffspring;
    });

    const error = POPULATION_SIZE - offspringDistribution.reduce((sum, n) => sum + n);
    const correctionDelta = error > 0 ? +1 : -1;
    let errorMagnitude = Math.abs(error);
    
    for(let i = 0; errorMagnitude > 0; i++) {
      const speciesIdx = i % offspringDistribution.length;
      if (offspringDistribution[speciesIdx] !== 0) {
        offspringDistribution[speciesIdx] += correctionDelta;
        errorMagnitude--;
      }
    }

    return offspringDistribution;
  }
}


const g = new Generation();
g.evolve();
const genomeA = g.species[0].representative;
const genomeB = g.species[1].representative;
console.log('parentA', genomeA);
console.log('parentB', genomeB);
console.log('offspring', Genome.crossover(genomeA, genomeB));

// console.log(g.species.length);
// g.evolve();
// console.log(g0.species.length);
// g0.evolve();
