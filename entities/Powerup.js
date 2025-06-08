export default class Powerup {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type; // 'health', 'speed', 'firerate'
      this.radius = 16;
      this.lifespan = 600; // 10 seconds
      this.alive = true;
  
      this.image = new Image();
      this.image.src = `./assets/powerups/${type}.svg`;
    }
  
    update() {
      this.lifespan--;
      if (this.lifespan <= 0) this.alive = false;
    }
  
    draw(ctx) {
      ctx.drawImage(this.image, this.x - 16, this.y - 16, 32, 32);
    }
  }
  