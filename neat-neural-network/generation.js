const { 
  NUM_INPUTS, 
  NUM_OUTPUTS, 
  POPULATION_SIZE,
  SPECIES_EXTINCTION_THRESHOLD,
  SPECIES_CULL_RATE,
  MAX_FITNESS,
  sleep
} = require('../constants');

const Genome = require('./genome');
const Species = require('./species');

class Generation {
  constructor() {
    this.species = [];
    this.genNumber = -1;
  }

  static makeInitialPopulation() {
    const primordialGenome = new Genome({ numInputs: NUM_INPUTS, numOutputs: NUM_OUTPUTS });
    return Genome.makeClones(primordialGenome, POPULATION_SIZE).map(genome => {
      for (const edge in genome.connections)
        genome.randomlyAssignWeight(edge);
      return genome;
    });
  }

  async simulateEvolution(numberGenerations) {
    console.clear();
    console.log('Generation'.rJust(14, ' '), 'Different Species'.rJust(19, ' '), 'Network Fitnesses'.rJust(20, ' '), 'Network Complexities');
    console.log(''.rJust(79, '-'));
    for (let i = 0; i < numberGenerations; i++) {
      this.evolve();

      const champions = this.species.map(species => species.getFittestMember());
      const champFitnesses = [];
      const champSizes = [];

      for (let champ of champions) {
        const fitness = champ.getFitness();
        champFitnesses.push(fitness);
        champSizes.push(champ.size());
      }

      console.log(`Gen-${i}`.rJust(14, ' '), `${champFitnesses.length}`.rJust(19, ' '),  champFitnesses.join(',').rJust(20, ' '), champSizes.join(','));

      const solution = champions.filter((_, i) => champFitnesses[i] >= MAX_FITNESS)[0];
      if (solution) {
        console.log('');
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<< FITNESS THRESHOLD REACHED >>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log('');
        console.log('...beginning simulation');
        await sleep(3000);
        await solution.animate();
        break;
      }
    }
  }

  evolve() {
    this.genNumber++;

    if (this.genNumber === 0) {
      const initialPopulation = Generation.makeInitialPopulation();
      this.speciate(initialPopulation);
      return;
    }

    const offspringDistribution = this.calculateOffspringDistribution();
    const nextPopulation = [];

    this.species.forEach((species, i) => {
      const numOffspring = offspringDistribution[i];
      species.setRandomRepresentative();
      species.cullMembers(SPECIES_CULL_RATE);
      const newMembers = species.reproduce(numOffspring);
      nextPopulation.push(...newMembers);
    });

    this.speciate(nextPopulation);
  }

  speciate(genomes) {
    this.species.forEach(species => species.eradicateMembers());

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

    this.species = this.species.filter(species => !species.isExtinct());
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

String.prototype.rJust = function(length, char) {
  const fill = [];
  while (fill.length + this.length < length) {
    fill[fill.length] = char;
  }
  return this + fill.join('');
};

const generation = new Generation();
generation.simulateEvolution(30);





