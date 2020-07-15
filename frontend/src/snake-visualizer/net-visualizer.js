import React from 'react';
import Graph from "react-graph-vis";
import { shadeColor } from '../util';

const NetVisualizer = (props) => {
  const { network, activations } = props;
  const nodes = [];
  const edges = [];

  const addNode = id => nodes.push({ id, label: id, color: shadeColor('#93950E', activations[id] * 100) });

  network.nodes.input.forEach(addNode);

  network.nodes.hidden.forEach(addNode);

  network.nodes.output.forEach(addNode);

  for (const edge in network.connections) {
    const weight = network.connections[edge].weight;
    const [ from, to ] = edge.split(',').map(Number);
    edges.push({ 
      from, 
      to,
      value: Math.abs(weight),
      arrows: {
        to: false
      },
      scaling: {
        min: 0.1,
        max: 2
      },
      color: weight > 0 ? '#7EBDC2' : '#D05353'
    });
  }

  const graph = {
    nodes,
    edges
  };
 
  const options = {
    layout: {
      hierarchical: {
        sortMethod: 'directed'
      }
    },
    height: "500px",
    width: "500px",
    physics: {
      enabled: false
    }
  };

  return (
    <Graph graph={graph} options={options} />
  );
};

export default NetVisualizer;