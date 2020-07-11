const { NUMBER_GENERATIONS }  = require('./constants');
const Generation = require('./neat-neural-network/generation');
(new Generation()).simulateEvolution(NUMBER_GENERATIONS);