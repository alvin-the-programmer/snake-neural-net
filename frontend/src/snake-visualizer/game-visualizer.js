import React from 'react';

const GameVisualizer = (props) => {
  const { grid } = props;
  const board = grid.map((row, rowIdx) => {
    return <tr key={rowIdx}>
      {
        row.map((val, valIdx) => {
          const style = {
            width: '18px', 
            height: '18px', 
            border: '2px solid #333333'
          };

          if (val === 'S') {
            style.backgroundColor = '#4E937A';
          } else if (val === 'H') {
            style.backgroundColor = '#C7F2A7';
          } else if (val === 'F') {
            style.backgroundColor = '#B4656F';
          } else {
            style.backgroundColor = '#333333'
          }

          return <td key={valIdx} style={style}></td>
        })
      }
    </tr>
  });

  return <table style={{margin: '6px', borderCollapse: 'collapse'}}>
    <tbody>
      {board}
    </tbody>
  </table>
};

export default GameVisualizer;