import Bullet from './Bullet.js';


export default class Player {
  constructor(x, y, bulletImage) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.speed = 3;
    this.angle = 0;
    this.hp = 10;
    this.invincibleTimer = 0; 
    this.maxHp = this.hp;
    this.image = new Image();
    this.image.src = './assets/player/player.svg';

    this.bulletPool = null;
    this.bulletImage = bulletImage;
    this.shootCooldown = 0;
    this.alive = true;
    this.upgraded = false;
    this.damage = 1;
  }

  update(input) {
    if (!this.alive) return;
    
    const move = input.moveVector;
    const aim = input.aimVector;
    this.x += move.x * this.speed;
    this.y += move.y * this.speed;
    this.x = Math.max(0, Math.min(this.x, 2048));
    this.y = Math.max(0, Math.min(this.y, 2048));

    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
    }    

    if (aim.x !== 0 || aim.y !== 0) {
      this.angle = Math.atan2(aim.y, aim.x);
    }

    if (this.shootCooldown > 0) this.shootCooldown--;

    if (input.shooting && this.shootCooldown === 0 && this.bulletPool) {
      this.bulletPool.get(
        this.x + Math.cos(this.angle) * 30,
        this.y + Math.sin(this.angle) * 30,
        this.angle,
        this.damage
      );
      this.shootCooldown = 10;
    }    

  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.invincibleTimer > 0) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'brightness(1.2) sepia(1) hue-rotate(-50deg) saturate(5)';
    }
    if (this.upgraded) {
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.strokeStyle = 'cyan';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.drawImage(this.image, -32, -32, 64, 64); // Centered
    ctx.filter = 'none';
    ctx.restore();
    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx) {
    const barWidth = 60;
    const barHeight = 6;
    const x = this.x - barWidth / 2;
    const y = this.y - 50;
  
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, barWidth, barHeight);
  
    const healthRatio = this.hp / this.maxHp;
    ctx.fillStyle = 'lime';
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);
  
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, barWidth, barHeight);
  }

  takeDamage(amount = 1) {
    if (this.invincibleTimer > 0) return;
    
    this.hp -= amount;
    this.invincibleTimer = 30; // i-frames (~0.5s)
   
 
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      console.log('Player died!');
      // TODO: trigger game over
    }
  }
  
  
  
}
