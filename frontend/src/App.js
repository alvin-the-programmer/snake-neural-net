import React from 'react';
import SnakeVisualizer from './snake-visualizer';

const testNetwork = {
  "nodes":{
    "input":[1,2,3,4,5,6],
    "hidden":[],
    "output":[7,8,9]
  },
  "connections": {
    "2,8":{"weight":0.7527353437617421,"enabled":true},
    "1,9":{"weight":-0.6262728795409203,"enabled":true},
    "4,9":{"weight":-0.2274287072941661,"enabled":true},
    "3,7":{"weight":0.6210636012256145,"enabled":true},
    "3,8":{"weight":-0.8429440390318632,"enabled":true},
    "5,9":{"weight":0.8071033381856978,"enabled":true},
    "6,9":{"weight":-0.7358349179849029,"enabled":true},
    "6,8":{"weight":-0.22758969850838184,"enabled":true},
    "6,7":{"weight":0.43175945337861776,"enabled":true},
    "1,8":{"weight":0.8647233373485506,"enabled":true},
    "5,7":{"weight":-0.3943643639795482,"enabled":true},
    "5,8":{"weight":-0.131782628595829,"enabled":true},
    "4,8":{"weight":-0.5817591515369713,"enabled":true},
    "4,7":{"weight":-0.36878868751227856,"enabled":true},
    "1,7":{"weight":-0.7969947718083858,"enabled":true},
    "2,7":{"weight":0.8597622746601701,"enabled":true},
    "3,9":{"weight":0.4358797096647322,"enabled":true},
    "2,9":{"weight":-0.274976946413517,"enabled":true}
  }
};

const App = () => {
  return <>
    <SnakeVisualizer network={testNetwork} />
  </>;
}

export default App;
