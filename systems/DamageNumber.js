export default class DamageNumber {
    constructor(x, y, text) {
      this.x = x;
      this.y = y;
      this.text = text;
      this.opacity = 1;
      this.lifespan = 40; // frames
      this.riseSpeed = 0.5;
    }
  
    update() {
      this.y -= this.riseSpeed;
      this.lifespan--;
      this.opacity = this.lifespan / 40;
    }
  
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = 'red';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(this.text, this.x, this.y);
      ctx.restore();
    }
  
    get alive() {
      return this.lifespan > 0;
    }
  }
  