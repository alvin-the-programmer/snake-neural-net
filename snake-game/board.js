const { WIDTH, HEIGHT, ALPHA, SNAKE_START_POS, GameOver } = require('./constants');
const Snake = require('./Snake');


class Board {
  constructor() {
    this.grid = new Array(HEIGHT).fill().map(() => new Array(WIDTH));
    this.snake = new Snake(SNAKE_START_POS);
    this.fillGrid();
  }

  fillGrid() {
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        this.grid[i][j] = ' ';
      }
    }
  }

  draw() {
    console.clear();
    this.fillGrid();
    let colHeader = ' ';
    this.grid[0].forEach((col, colIndex) => {
      colHeader += ALPHA[colIndex] + ' ';
    });
    console.log(colHeader);
    this.snake.positions.forEach(([row, col]) => this.grid[row][col] = '█');
    this.grid.forEach((row, rowIndex) => {
      console.log(ALPHA[rowIndex] + row.join('|'));
    });
  }

  simulate() {
    try {
      this.snake.move();
    } catch (error) {
      if (error instanceof GameOver) {
        console.log('GAME OVER!');
        process.exit();
      } else {
        throw error;
      }
    }
    this.draw();
  }

  debug() {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', key => {
      if (key === '\u0003') process.exit();
      if (key === ' ') this.simulate();
      if (key === 'w') {
        this.snake.up();
        this.simulate();
      }
      if (key === 'a') {
        this.snake.left();
        this.simulate();
      }
      if (key === 's') {
        this.snake.down();
        this.simulate();
      }
      if (key === 'd') {
        this.snake.right();
        this.simulate();
      }
    });
  }
};

module.exports = Board;