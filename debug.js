const { NeuralNetwork, FitnessLandscape } = require('./neat-neural-network');
const fs = require('fs');

const logFilePath = process.argv[2];

fs.readFile(logFilePath, 'utf8', (err, data) => {
  if (err) 
    throw err;
  console.log(data);
  const net = NeuralNetwork.fromJSON(data);
  (new FitnessLandscape(net)).animate();
});

