const { 
  WIDTH, 
  HEIGHT, 
  ALPHA, 
  SNAKE_START_POS, 
  START_HEALTH,
  MAX_FITNESS,
  GameOver 
} = require('./constants');

const Snake = require('./Snake');

class Board {
  constructor() {
    this.grid = new Array(HEIGHT).fill().map(() => new Array(WIDTH));
    this.snake = new Snake(SNAKE_START_POS);
    this.foodPos = [ 10, 13 ];
    this.fillGrid();
    this.health = START_HEALTH;
    this.fitness = 0;
    this.food_score = 0;
  }

  static allPositions() {
    const positions = [];
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        positions.push([ i, j ]);
      }
    }
    return positions;
  }

  static positionToEnum(pos) {
    const [ row, col ] = pos;
    return row * WIDTH + col;
  }

  getState() {
    let [ snakeHeadEnum, ...snakeBodyEnums ] = this.snake.positions.map(Board.positionToEnum);
    let foodEnum = Board.positionToEnum(this.foodPos); 
    const state = {};
    Board.allPositions().map(Board.positionToEnum).forEach(posEnum => state[posEnum] = 0);
    snakeBodyEnums.forEach(posEnum => state[posEnum] = 1);
    state[snakeHeadEnum] = 2;
    state[foodEnum] = 3;
    return state;
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

    console.log('health:', this.health + '/' + MAX_FITNESS);
    console.log('fitness:', this.fitness);
    console.log('food_score:', this.food_score);
  }

  simulate() {
    this.health--;
    this.fitness++;
    try {
      if (this.snake.move(this.foodPos)) {
        this.food_score++;
        this.health = Math.min(this.health + 51, MAX_FITNESS);
        this.placeRandomFood();
      }
    } catch (error) {
      if (error instanceof GameOver || this.health === 0) {
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