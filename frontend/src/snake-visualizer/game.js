import { 
  getRandomElement,
  distanceNormalizer,
  GameOver,
  DIRECTION
 } from './util';

class SnakeGame {
  constructor() {
    this.grid = new Array(20).fill().map(() => new Array(20));
    this.snake = new Snake([5, 5]);
    this.fillGrid();
    this.foodScore = 0;
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

  getNeuralNetInputState() {
    const { forwardDistance, leftDistance, rightDistance } = this.foodDistance();
    const foodDistances = [ leftDistance, forwardDistance, rightDistance ]
      .map(n => Number(distanceNormalizer(n).toFixed(6)));
    const adjacentObstacles = [ this.isLeftObstacle(), this.isForwardObstacle() ,this.isRightObstacle() ];
    return [ ...foodDistances, ...adjacentObstacles ];
  }

  isObstacle(row, col) {
    const snakePositions = new Set(this.snake.positions.map(pos => String(pos)));
    const isSnake = snakePositions.has(String([row, col]));
    const isWall = row === -1 || row === HEIGHT || col === -1 || col === WIDTH;
    return isSnake || isWall ? 1 : 0;
  }

  foodDistance() {
    const [ headRow, headCol ] = this.snake.positions[0];
    const [ foodRow, foodCol ] = this.foodPos;
    const verticalDistance = headRow - foodRow;
    const horizontalDistance = headCol - foodCol;
    if (this.snake.angle === 0) {
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

  getAvailablePositions() {
    const snakePositions = new Set(this.snake.positions.map(String));
    return SnakeGame.allPositions().filter(pos => !snakePositions.has(String(pos)));
  }

  getRandomPosition() {
    return getRandomElement(this.getAvailablePositions());
  }

  placeRandomFood() {
    this.foodPos = this.getRandomPosition();
  }

  fillGrid() {
    SnakeGame.allPositions().forEach(([r, c]) => this.grid[r][c] = ' ');
  }

  draw() {
    this.fillGrid();

    this.snake.positions.forEach(([row, col], i) => {
      if (i === 0) {
        this.grid[row][col] = 'H';
      } else {
        this.grid[row][col] = 'S';
      }
    });

    const [ foodRow, foodCol ] = this.foodPos;
    this.grid[foodRow][foodCol] = 'F';
    
    return this.grid;
  }

  simulate() {
    if (this.snake.move(this.foodPos)) {
      this.foodScore++;
      this.placeRandomFood();
    }
  }

  input(direction) {
    if (!(Object.values(DIRECTION).includes(direction)))
      throw Error(`invalid direction ${direction}`);
    this.snake[direction]();
  }
}

class Snake {
  constructor(startPos) {
    const [ startRow, startCol ] = startPos;

    this.positions = [
      [ startRow, startCol ]
    ];

    this.angle = 0;
  };

  turnLeft() {
    this.angle = this.angle - 90;
    if (this.angle < 0)
      this.angle = 360 - Math.abs(this.angle);
  }

  turnRight() {
    this.angle = this.angle + 90;
    if (this.angle >= 360)
      this.angle = this.angle - 360;
  }

  straight() {
    this.angle = this.angle;
  }

  move(foodPos) {
    const [ head, ...body ] = this.positions;
    const [ headRow, headCol ] = head;
    const delta = {
      0: { x: 0, y: -1 },
      90: { x: 1, y: 0 },
      180: { x: 0, y: 1 },
      270: { x: -1, y: 0 }
    };

    const change = delta[this.angle];

    const newHeadPos = [ headRow + change.y, headCol + change.x ];

    if (this.isCollision(newHeadPos))
      throw new GameOver('collision made'); 
    
    this.positions.unshift(newHeadPos); 
      
    if (String(newHeadPos) === String(foodPos)) {
      if (!SNAKE_GROW)
        this.positions.pop();

      return true;
    } else {
      this.positions.pop();
      return false;
    }
  }

  isWallCollision(pos) {
    const [ row, col ] = pos;
    return row < 0 || row >= 20 || col < 0 || col >= 20;
  }

  isSelfCollision(pos) {
    const selfPositions = new Set(this.positions.slice(0, -1).map(String));
    return selfPositions.has(String(pos));
  }

  isCollision(pos) {
    return this.isWallCollision(pos) || this.isSelfCollision(pos);
  }
}

export default SnakeGame;