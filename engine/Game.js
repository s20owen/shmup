import Player from '../entities/Player.js';
import InputManager from '../systems/InputManager.js';
import Camera from '../utils/Camera.js';
import Enemy from '../entities/Enemy.js';
import BulletPool from '../systems/BulletPool.js';
import EnemyPool from '../systems/EnemyPool.js';
import DamageNumber from '../systems/DamageNumber.js';
import DamageNumberPool from '../systems/DamageNumberPool.js';
import WaveManager from '../systems/WaveManager.js';
import Powerup from '../entities/Powerup.js';
import AchievementManager from '../systems/AchievementManager.js';


const WORLD_WIDTH = 2048;
const WORLD_HEIGHT = 2048;
const TILE_SIZE = 64;

export default class Game {
  constructor(canvas, ctx, bulletImage) {
    this.mode = 'single';
    this.canvas = canvas;
    this.ctx = ctx;
    this.input = new InputManager();
    this.player = new Player(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, bulletImage);
    this.camera = new Camera(this.player, canvas.width, canvas.height, WORLD_WIDTH, WORLD_HEIGHT);
    this.tileImage = new Image();
    this.tileImage.src = './assets/tiles/grass.svg';
    this.enemies = [];
    this.enemySpawnTimer = 0;
    this.bulletPool = new BulletPool(bulletImage);
    this.enemyPool = new EnemyPool(this.player);
    this.player.bulletPool = this.bulletPool;
    this.player.gameRef = this;
    this.damageNumberPool = new DamageNumberPool();
    this.spawnPowerup = (x, y, type) => {
      this.powerups.push(new Powerup(x, y, type)); // ✅ real Powerup object
    };    
    this.waveManager = new WaveManager(this.enemyPool, WORLD_WIDTH, WORLD_HEIGHT);
    this.waveManager.spawnPowerup = this.spawnPowerup;

    this.powerups = [];
    this.paused = false;
    this.decorations = [];
    this.decorationImages = {
      tree: new Image(),
      bush: new Image(),
      rock: new Image(),
    };
    
    this.decorationImages.tree.src = './assets/props/tree.svg';
    this.decorationImages.bush.src = './assets/props/bush.svg';
    this.decorationImages.rock.src = './assets/props/rock.svg';
    const spacing = 64;
    for (let x = 0; x <= WORLD_WIDTH; x += spacing) {
      this.decorations.push({ x, y: 0, type: 'tree' });
      this.decorations.push({ x, y: WORLD_HEIGHT, type: 'tree' });
    }
    for (let y = 0; y <= WORLD_HEIGHT; y += spacing) {
      this.decorations.push({ x: 0, y, type: 'tree' });
      this.decorations.push({ x: WORLD_WIDTH, y, type: 'tree' });
    }

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * WORLD_WIDTH;
      const y = Math.random() * WORLD_HEIGHT;
      const type = ['tree', 'bush', 'rock'][Math.floor(Math.random() * 3)];
      this.decorations.push({ x, y, type });
    }
    this.score = parseInt(localStorage.getItem('score')) || 0;
    this.enemiesKilled = 0;
    this.bossesKilled = 0;
    this.achievementManager = new AchievementManager(this);
    this.magnetEnabled = false;

  }

  start() {
    document.getElementById('pauseBtn').addEventListener('click', () => {
      this.paused = !this.paused;
      document.getElementById('pauseBtn').innerText = this.paused ? 'Resume' : 'Pause';
    });
    this.canvas.addEventListener('click', () => {
      if (!this.player.alive) {
        window.location.reload(); // or implement a proper reset()
      }
    });

    if (this.mode === 'coop') {
      this.player2 = new Player(WORLD_WIDTH / 2 + 100, WORLD_HEIGHT / 2 + 100, this.player.bulletImage);
      this.player2.bulletPool = this.bulletPool;
      this.player2.gameRef = this;
    }
    
    const loop = () => {
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    loop();
  }

  update() {
    if (this.paused) return;
    this.input.update();
    this.player.update(this.input);
    if (this.mode === 'coop' && this.player2) {
      this.player2.update({
        moveVector: this.input.p2MoveVector,
        aimVector: { x: 1, y: 0 }, // placeholder or implement p2AimVector
        shooting: this.input.p2Shooting
      });
    }
    this.camera.update();
    this.enemyPool.updateAll();
    this.bulletPool.updateAll();
    const bullets = this.bulletPool.getAllActive();
    const enemies = this.enemyPool.getAllActive();
    this.damageNumberPool.updateAll();
    this.powerups = this.powerups.filter(p => p.alive);
    this.powerups.forEach(p => p.update(this.player, this.magnetEnabled));
  
    // enemy spawn
    this.waveManager.update();
    if (this.enemySpawnTimer <= 0) {
      this.enemySpawnTimer = 180; // spawn every 3 seconds
      const edge = Math.floor(Math.random() * 4); // 0 = top, 1 = right, 2 = bottom, 3 = left
      let spawnX, spawnY;
  
      switch (edge) {
        case 0: // top
          spawnX = Math.random() * 2048;
          spawnY = -100;
          break;
        case 1: // right
          spawnX = 2048 + 100;
          spawnY = Math.random() * 2048;
          break;
        case 2: // bottom
          spawnX = Math.random() * 2048;
          spawnY = 2048 + 100;
          break;
        case 3: // left
          spawnX = -100;
          spawnY = Math.random() * 2048;
          break;
      }
  
      const enemy = this.enemyPool.get(spawnX, spawnY); 
    }
    
   /* for (const bullet of bullets) {
      if (!bullet.alive) continue;
    
      for (const enemy of enemies) {
        if (!enemy.alive) continue;
    
        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        const dist = Math.hypot(dx, dy);
    
        if (dist < bullet.radius + enemy.radius) {

          enemy.takeDamage();
          bullet.alive = false;
          this.damageNumberPool.get(enemy.x, enemy.y - 20, '-1');
          if (!enemy.alive && Math.random() < 0.30) { // 30% chance

            const types = ['health', 'speed', 'firerate'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.powerups.push(new Powerup(enemy.x, enemy.y, type));
          }
          if (enemy.isBoss && !enemy.alive) {
            this.spawnPowerup(enemy.x, enemy.y, 'weapon-upgrade');
          }
          break; // stop checking other enemies for this bullet
        }

      }
    }*/
    // enemy taking damage from bullet
    for (const bullet of bullets) {
      if (!bullet.alive) continue;

      for (const enemy of enemies) {
        if (!enemy.alive) continue;
      
        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        const dist = Math.hypot(dx, dy);
      
        if (dist < bullet.radius + enemy.radius) {
          enemy.takeDamage();
          bullet.alive = false;
          this.damageNumberPool.get(enemy.x, enemy.y - 20, '-1');
      
          if (!enemy.alive) {
            // ✅ Score and kill tracking
            this.score += enemy.isBoss ? 100 : 10;
            this.enemiesKilled++;
            if (enemy.isBoss) this.bossesKilled++;
            localStorage.setItem('score', this.score);
      
            // 🎁 Powerup drops
            if (Math.random() < 0.30) {
              const types = ['health', 'speed', 'firerate', 'magnet'];
              const type = types[Math.floor(Math.random() * types.length)];
              this.powerups.push(new Powerup(enemy.x, enemy.y, type));
            }
      
            // 🏆 Weapon upgrade drop on boss death
            if (enemy.isBoss) {
              this.spawnPowerup(enemy.x, enemy.y, 'weapon-upgrade');
            }
          }
      
          break; // stop checking other enemies for this bullet
        }
      }
      

    }
    
    // player taking damage from enemy
    for (const enemy of this.enemyPool.getAllActive()) {
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist < enemy.radius + this.player.radius) {
        this.player.takeDamage(this.damage);
        // Optional: add knockback or particle later
      }
    }

        // Check player pickup
    for (const p of this.powerups) {
      const dx = p.x - this.player.x;
      const dy = p.y - this.player.y;
      const dist = Math.hypot(dx, dy);
      if (dist < p.radius + this.player.radius) {
        this.applyPowerup(p.type);
        p.alive = false;
      }
    }

    this.achievementManager.update();
    
  }
  

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    //this.ctx.translate(-this.camera.x, -this.camera.y);
    this.ctx.translate(-this.camera.x + this.camera.shakeOffsetX, -this.camera.y + this.camera.shakeOffsetY);

    
    // Draw tile-based background
    for (let x = 0; x < WORLD_WIDTH; x += TILE_SIZE) {
      for (let y = 0; y < WORLD_HEIGHT; y += TILE_SIZE) {
        this.ctx.drawImage(this.tileImage, x, y, TILE_SIZE, TILE_SIZE);
      }
    }
    this.decorations.forEach((d) => {
      const img = this.decorationImages[d.type];
      if (img?.complete && img.naturalWidth > 0) {
        this.ctx.drawImage(img, d.x - 32, d.y - 32, 64, 64);
      }
    });

    this.enemyPool.drawAll(this.ctx);
    this.player.draw(this.ctx); // still handles the player
    this.bulletPool.drawAll(this.ctx); 
    this.damageNumberPool.drawAll(this.ctx);
    this.powerups.forEach(p => p.draw(this.ctx));
    
    this.ctx.restore();
    
    // countdown thing
    /*const countdown = this.waveManager.getCountdownNumber();
    if (countdown !== null) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 48px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        countdown,
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    }*/
    if (!this.player.alive) {
      
      this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
      this.ctx.fillStyle = 'white';
      this.ctx.font = '48px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.font = '24px sans-serif';
      this.ctx.fillText('Tap to Restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    if (this.paused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 32px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Paused', this.canvas.width / 2, this.canvas.height / 2);
    }

    // Score display (top-center)
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, 30);

    if (this.mode === 'coop' && this.player2) {
      this.player2.draw(this.ctx);
    }
    
  }

  applyPowerup(type) {
    switch (type) {
      case 'health':
        this.player.hp = Math.min(this.player.hp + 3, this.player.maxHp);
        break;

        case 'speed':
          this.player.speed += 0.5;
          this.player.speedBoosts = (this.player.speedBoosts || 0) + 1;
          setTimeout(() => {
            this.player.speed -= 0.5;
            this.player.speedBoosts--;
          }, 5000);
          break;

      case 'firerate':
        this.player.shootCooldown = Math.max(1, this.player.shootCooldown - 3);
        setTimeout(() => this.player.shootCooldown += 3, 5000);
        break;

      case 'magnet':
        this.magnetEnabled = true;
      break;

      case 'weapon-upgrade':
        this.player.upgraded = true;
        this.player.shootCooldown = 2;
        this.player.damage = 2;
        break;
    }
  }

  showAchievementBanner(text) {
    const banner = document.getElementById('achievementBanner');
    banner.innerText = text;
    banner.style.display = 'block';
    banner.style.opacity = 1;
  
    setTimeout(() => {
      banner.style.transition = 'opacity 1s ease';
      banner.style.opacity = 0;
      setTimeout(() => {
        banner.style.display = 'none';
        banner.style.transition = '';
      }, 1000);
    }, 3000);
  }
  
  
}
