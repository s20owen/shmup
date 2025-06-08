export default class Enemy {
    constructor(x, y, player) {
      this.x = x;
      this.y = y;
      this.player = player;
      this.speed = 1.3;
      this.radius = 20;
      this.rotation = 0;
  
      this.image = new Image();
      this.image.src = './assets/enemies/enemy.svg'; // Your image

      this.hp = 3;
      this.maxHp = this.hp;
      this.alive = true;
    }

    reset(x, y, isBoss = false, spawnPowerup = null) {
      this.x = x;
      this.y = y;
      this.alive = true;
      this.isBoss = isBoss;
      this.spawnPowerup = spawnPowerup;
    
      if (isBoss) {
        this.hp = 20;
        this.speed = 0.8;
        this.radius = 28;
        this.image.src = './assets/enemies/boss.svg';
      } else {
        this.hp = 3;
        this.speed = 1.3;
        this.radius = 20;
        this.image.src = './assets/enemies/enemy.svg';
      }
      this.maxHp = this.hp;
    }
    
  
    update() {
      const dx = this.player.x - this.x;
      const dy = this.player.y - this.y;
      this.rotation = Math.atan2(dy, dx);
      const angle = Math.atan2(dy, dx);
      this.x += Math.cos(angle) * this.speed;
      this.y += Math.sin(angle) * this.speed;
    }
  
    draw(ctx) {
     if (!this.alive) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.drawImage(this.image, -32, -32, 64, 64);
      ctx.restore();
      this.drawHealthBar(ctx);
    }

    takeDamage(damage = 1) {
        this.hp -= damage;
        if (this.hp <= 0) {
          this.alive = false;
          if (this.isBoss && this.spawnPowerup) {
            this.spawnPowerup(this.x, this.y, 'weapon-upgrade');
          }
        }
      }

      drawHealthBar(ctx) {
        const barWidth = 40;
        const barHeight = 5;
        const x = this.x - barWidth / 2;
        const y = this.y - 40;
      
        // background
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, barWidth, barHeight);
      
        // foreground
        const healthRatio = this.hp / this.maxHp;
        ctx.fillStyle = 'lime';
        ctx.fillRect(x, y, barWidth * healthRatio, barHeight);
      
        // border
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, barWidth, barHeight);
      }
      
      
  }
  