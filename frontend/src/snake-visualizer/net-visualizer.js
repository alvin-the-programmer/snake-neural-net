import React from 'react';
import Graph from "react-graph-vis";

const BLUE = '#4E937A';
const RED = '#B4656F'
const BRIGHT_GREEN = 'rgb(199, 242, 167)';

const RGB_Log_Shade=(p,c)=>{
  var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:p*255**2,P=P?1+p:1-p;
  return"rgb"+(d?"a(":"(")+r((P*i(a[3]=="a"?a.slice(5):a.slice(4))**2+t)**0.5)+","+r((P*i(b)**2+t)**0.5)+","+r((P*i(c)**2+t)**0.5)+(d?","+d:")");
}


const NetVisualizer = (props) => {
  const { network, activations } = props;
  const nodes = [];
  const edges = [];

  const addNode = id => nodes.push({ id, label: id, color: RGB_Log_Shade(-(1 - activations[id]), BRIGHT_GREEN)});

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
      color: weight > 0 ? BLUE : RED
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
    height: "300px",
    width: "300px",
    physics: {
      enabled: false
    }
  };

  return (
    <Graph graph={graph} options={options} style={{width: '400px', height: '400px', transform: 'rotate(-90deg) translate(90px, 0)'}}  />
  );
};

export default NetVisualizer;