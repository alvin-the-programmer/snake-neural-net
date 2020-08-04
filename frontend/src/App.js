import React from 'react';
import SnakeVisualizer from './snake-visualizer';
import looperNetwork from './species/looper-species';
import zigZagNetwork from './species/zig-zag-species';
import contractorNetwork from './species/contractor-species';
import sShapeNetwork from './species/s-shape-species';


const App = () => {
  return <>
    <SnakeVisualizer network={looperNetwork} />
    <SnakeVisualizer network={zigZagNetwork} />
    <SnakeVisualizer network={contractorNetwork} />
  </>;
}

export default App;
