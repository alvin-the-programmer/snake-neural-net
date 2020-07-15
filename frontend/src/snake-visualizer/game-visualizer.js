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
            // border: '1px solid black'
          };

          if (val === 'S') {
            style.backgroundColor = 'blue';
          } else if (val === 'H') {
            style.backgroundColor = 'purple';
          } else if (val === 'F') {
            style.backgroundColor = 'green';
          } else {
            style.backgroundColor = 'white'
          }

          return <td key={valIdx} style={style}></td>
        })
      }
    </tr>
  });

  return <table style={{border: '2px solid black', margin: '6px'}}>
    <tbody>
      {board}

    </tbody>
  </table>
};

export default GameVisualizer;