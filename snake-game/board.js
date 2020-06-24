const { 
  WIDTH, 
  HEIGHT, 
  ALPHA, 
  SNAKE_START_POS, 
  START_FITNESS,
  MAX_FITNESS,
  GameOver 
} = require('./constants');

const Snake = require('./Snake');

class Board {
  constructor() {
    this.grid = new Array(HEIGHT).fill().map(() => new Array(WIDTH));
    this.snake = new Snake(SNAKE_START_POS);
    this.foodPos = [ 5, 13 ];
    this.fillGrid();
    this.fitness = START_FITNESS;
  }

  static allPositions() {
    const positions = []
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        positions.push([ i, j ]);
      }
    }
    return positions;
  }

  availablePositions() {
    const snakePositions = new Set(this.snake.positions.map(String));
    return Board.allPositions().filter(pos => !snakePositions.has(String(pos)));
  }

  placeRandomFood() {
    const availablePositions = this.availablePositions();
    this.foodPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
  }

  fillGrid() {
    Board.allPositions().forEach(([r, c]) => this.grid[r][c] = ' ');
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

    const [ foodRow, foodCol ] = this.foodPos;
    this.grid[foodRow][foodCol] = '●';

    this.grid.forEach((row, rowIndex) => {
      console.log(ALPHA[rowIndex] + row.join('|'));
    });

    console.log('fitness:', this.fitness + '/' + MAX_FITNESS);
  }

  simulate() {
    this.fitness--;
    try {
      if (this.snake.move(this.foodPos)) {
        this.fitness = Math.min(this.fitness + 51, MAX_FITNESS);
        this.placeRandomFood();
      }
    } catch (error) {
      if (error instanceof GameOver || this.fitness === 0) {
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
      if (key === '\u0003')
        process.exit();
      if (key === 'w')
        this.snake.up();
      if (key === 'a')
        this.snake.left();
      if (key === 's')
        this.snake.down();
      if (key === 'd')
        this.snake.right();

      this.simulate()
    });
  }
};

module.exports = Board;