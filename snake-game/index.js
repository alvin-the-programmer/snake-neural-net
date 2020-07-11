const { 
  WIDTH, 
  HEIGHT,
  DIRECTION,
  ALPHA, 
  SNAKE_START_POS, 
  START_HEALTH,
  MAX_HEALTH,
  MAX_FITNESS,
  SNAKE_ORIENTATION_SYMBOL,
  makeGetSeededRandomInt,
  distanceNormalizer,
  GameOver,
} = require('../constants');

const Snake = require('./Snake');

class SnakeGame {
  constructor() {
    this.grid = new Array(HEIGHT).fill().map(() => new Array(WIDTH));
    this.snake = new Snake(SNAKE_START_POS);
    this.fillGrid();
    this.health = START_HEALTH;
    this.foodScore = 0;
    this.getSeededRandomInt = makeGetSeededRandomInt();
    this.foodPos = null;
    this.placeRandomFood();
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

  getNeuralNetInputState() {
    const { forwardDistance, leftDistance, rightDistance } = this.foodDistance();

    const foodDistances = [ leftDistance, forwardDistance, rightDistance ]
      .map(n => Number(distanceNormalizer(n).toFixed(6)));

    const adjacentObstacles = [ this.isLeftObstacle(), this.isForwardObstacle() ,this.isRightObstacle()];
    return [ ...foodDistances, ...adjacentObstacles ];
  }

  foodDistance() {
    const [ headRow, headCol ] = this.snake.positions[0];
    const [ foodRow, foodCol ] = this.foodPos;
    const verticalDistance = headRow - foodRow;
    const horizontalDistance = headCol - foodCol;
    if (this.snake.angle === 0) { // not clever enough to make this clean ¯\_(ツ)_/¯
      return {
        forwardDistance: verticalDistance >= 0 ? verticalDistance : null, 
        leftDistance: horizontalDistance >= 0 ? horizontalDistance : null,
        rightDistance: horizontalDistance <= 0 ? Math.abs(horizontalDistance) : null
      }
    } else if (this.snake.angle === 90) {
      return {
        forwardDistance: horizontalDistance <= 0 ? Math.abs(horizontalDistance) : null, 
        leftDistance: verticalDistance >= 0 ? verticalDistance : null,
        rightDistance: verticalDistance <= 0 ? Math.abs(verticalDistance) : null
      }
    } else if (this.snake.angle === 180) {
      return {
        forwardDistance: verticalDistance <= 0 ? Math.abs(verticalDistance) : null,
        leftDistance: horizontalDistance <= 0 ? Math.abs(horizontalDistance) : null,
        rightDistance: horizontalDistance >= 0 ? horizontalDistance : null,
      }
    } else if (this.snake.angle === 270) {
      return {
        forwardDistance: horizontalDistance >= 0 ? horizontalDistance : null,
        leftDistance: verticalDistance <= 0 ? Math.abs(verticalDistance) : null,
        rightDistance: verticalDistance >= 0 ? verticalDistance : null,
      }
    }
  }

  obstacleDistance() {
    const [ headRow, headCol ] = this.snake.positions[0];

  }

  isForwardObstacle() {
    const [ headRow, headCol ] = this.snake.positions[0];

    if (this.snake.angle === 0) {
      return this.isObstacle(headRow - 1, headCol);
    } else if (this.snake.angle === 90) {
      return this.isObstacle(headRow, headCol + 1);
    } else if (this.snake.angle === 180) {
      return this.isObstacle(headRow + 1, headCol);
    } else if (this.snake.angle === 270) {
      return this.isObstacle(headRow, headCol - 1);
    }
  }

  isLeftObstacle() {
    const [ headRow, headCol ] = this.snake.positions[0];

    if (this.snake.angle === 0) {
      return this.isObstacle(headRow, headCol - 1);
    } else if (this.snake.angle === 90) {
      return this.isObstacle(headRow - 1, headCol);
    } else if (this.snake.angle === 180) {
      return this.isObstacle(headRow, headCol + 1);
    } else if (this.snake.angle === 270) {
      return this.isObstacle(headRow + 1, headCol);
    }
  }

  isRightObstacle() {
    const [ headRow, headCol ] = this.snake.positions[0];

    if (this.snake.angle === 0) {
      return this.isObstacle(headRow, headCol + 1);
    } else if (this.snake.angle === 90) {
      return this.isObstacle(headRow + 1, headCol);
    } else if (this.snake.angle === 180) {
      return this.isObstacle(headRow, headCol - 1);
    } else if (this.snake.angle === 270) {
      return this.isObstacle(headRow + -1, headCol);
    }
  }

  isObstacle(row, col) {
    const snakePositions = new Set(this.snake.positions.map(pos => String(pos)));
    const isSnake = snakePositions.has(String([row, col]));
    const isWall = row === -1 || row === HEIGHT || col === -1 || col === WIDTH;
    return isSnake || isWall ? 1 : 0;
  }

  availablePositions() {
    const snakePositions = new Set(this.snake.positions.map(String));
    return SnakeGame.allPositions().filter(pos => !snakePositions.has(String(pos)));
  }

  placeRandomFood() {
    const availablePositions = this.availablePositions();
    this.foodPos = availablePositions[this.getSeededRandomInt(0, availablePositions.length)];
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

    this.snake.positions.forEach(([row, col], i) => {
      if (i === 0) {
        this.grid[row][col] = SNAKE_ORIENTATION_SYMBOL[this.snake.angle];
      } else {
        this.grid[row][col] = '█';
      }
    });

    const [ foodRow, foodCol ] = this.foodPos;
    this.grid[foodRow][foodCol] = '●';

    this.grid.forEach((row, rowIndex) => {
      console.log(ALPHA[rowIndex] + row.join('|'));
    });

    console.log('health:', this.health + '/' + MAX_HEALTH);
    console.log('foodScore:', this.foodScore);
    console.log('neuralNetInput:', this.getNeuralNetInputState());
  }

  simulate() {
    this.health--;

    if (this.snake.move(this.foodPos)) {
      this.foodScore++;
      this.health = Math.min(this.health + 51, MAX_HEALTH);
      this.placeRandomFood();
    }

    if (this.health === 0)
      throw new GameOver('zero health reached');

    if (this.foodScore === MAX_FITNESS)
      throw new GameOver('max score reached');
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
    stdin.setEncoding('utf8')
    console.log('press w, a, d');
    stdin.on('data', key => {
      if (key === '\u0003')
        process.exit();
      if (key === 'w')
        this.input(DIRECTION.STRAIGHT);
      if (key === 'a')
        this.input(DIRECTION.TURN_LEFT);
      if (key === 'd')
        this.input(DIRECTION.TURN_RIGHT);
        this.simulate();
        this.draw();
    });
  }
};

module.exports = SnakeGame;