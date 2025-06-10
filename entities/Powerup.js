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
  
    update(player, magnetEnabled = false) {
      this.lifespan--;
      if (this.lifespan <= 0) this.alive = false;
    
      if (magnetEnabled) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);
        const speed = 2.5;
    
        if (dist > 5) {
          this.x += (dx / dist) * speed;
          this.y += (dy / dist) * speed;
        }
      }
    }
    
  
    draw(ctx) {
      ctx.drawImage(this.image, this.x - 16, this.y - 16, 32, 32);
    }
  }
  