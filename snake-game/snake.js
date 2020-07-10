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

    this.angle = 90;
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

    console.log(this.angle);
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