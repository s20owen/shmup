export default class Bullet {
    constructor(x, y, angle, image) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = 10;
      this.radius = 4;
      this.lifespan = 60;
      this.alive = true;
      this.image = image;
    }
  
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.lifespan--;
      if (this.lifespan <= 0) this.alive = false;
    }
  
    draw(ctx) {
      if (!this.image?.complete || this.image.naturalWidth === 0) return;
  
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      //ctx.fillStyle = 'lime';
        //ctx.fillRect(-8, -8, 16, 16);
        ctx.drawImage(this.image, -16, -16, 32, 32);
      ctx.restore();
    }
  }
  