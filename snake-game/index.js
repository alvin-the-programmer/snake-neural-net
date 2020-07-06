const { 
  WIDTH, 
  HEIGHT,
  DIRECTION,
  ALPHA, 
  SNAKE_START_POS, 
  START_HEALTH,
  MAX_HEALTH,
  getRandomInt,
  GameOver,
} = require('../constants');

const Snake = require('./Snake');

class SnakeGame {
  constructor() {
    this.grid = new Array(HEIGHT).fill().map(() => new Array(WIDTH));
    this.snake = new Snake(SNAKE_START_POS);
    this.foodPos = [ getRandomInt(0, HEIGHT), getRandomInt(0, WIDTH) ];
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
    const state = {
      head: this.snake.positions[0],
      food: this.foodPos
    };

    return [ ...state.head, ...state.food ];
  }

  // getState() {
  //   let [ snakeHeadEnum, ...snakeBodyEnums ] = this.snake.positions.map(SnakeGame.positionToEnum);
  //   let foodEnum = SnakeGame.positionToEnum(this.foodPos); 
  //   const state = {};
  //   SnakeGame.allPositions().map(SnakeGame.positionToEnum).forEach(posEnum => state[posEnum] = 0);
  //   snakeBodyEnums.forEach(posEnum => state[posEnum] = 1);
  //   state[snakeHeadEnum] = 2;
  //   state[foodEnum] = 3;
  //   return state;
  // }

  availablePositions() {
    const snakePositions = new Set(this.snake.positions.map(String));
    return SnakeGame.allPositions().filter(pos => !snakePositions.has(String(pos)));
  }

  placeRandomFood() {
    const availablePositions = this.availablePositions();
    this.foodPos = availablePositions[Math.floor(Math.random() * availablePositions.length)];
  }

  fillGrid() {
    SnakeGame.allPositions().forEach(([r, c]) => this.grid[r][c] = ' ');
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

    console.log('health:', this.health + '/' + MAX_HEALTH);
    console.log('fitness:', this.fitness);
    console.log('food_score:', this.food_score);
    console.log('state:', this.getState());
  }

  simulate() {
    this.health--;
    this.fitness++;

    if (this.snake.move(this.foodPos)) {
      this.food_score++;
      this.health = Math.min(this.health + 51, MAX_HEALTH);
      this.placeRandomFood();
    }

    if (this.health === 0)
      throw new GameOver('zero health reached');
  }

  input(direction) {
    if (!(Object.values(DIRECTION).includes(direction)))
      throw Error(`invalid direction ${direction}`);
    this.snake[direction]();
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
        this.input(DIRECTION.UP);
      if (key === 'a')
        this.input(DIRECTION.LEFT);
      if (key === 's')
        this.input(DIRECTION.DOWN);
      if (key === 'd')
        this.input(DIRECTION.RIGHT);
        this.simulate();
        this.draw();
    });
  }
};

module.exports = SnakeGame;