const { 
  WIDTH, 
  HEIGHT,
  SNAKE_GROW,
  GameOver 
} = require('../constants');

class Snake {
  constructor(startPos) {
    const [ startRow, startCol ] = startPos;

    this.positions = [
      [ startRow, startCol ]
    ];

    this.right();
  };

  up() {
    this.direction = { x: 0, y: -1 };
  }

  down() {
    this.direction = { x: 0, y: 1 };
  }

  left() {
    this.direction = { x: -1, y: 0 };
  }

  right() {
    this.direction = { x: 1, y: 0 };
  }

  move(foodPos) {
    const [ head, ...body ] = this.positions;
    const [ headRow, headCol ] = head;
    const newHeadPos = [ headRow + this.direction.y, headCol + this.direction.x ];

    if (this.isCollision(newHeadPos))
      throw new GameOver(); 
    
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
    return row < 0 || row >= HEIGHT || col < 0 || col >= WIDTH;
  }

  isSelfCollision(pos) {
    const selfPositions = new Set(this.positions.slice(0, -1).map(String));
    return selfPositions.has(String(pos));
  }

  isCollision(pos) {
    return this.isWallCollision(pos) || this.isSelfCollision(pos);
  }
}

module.exports = Snake;