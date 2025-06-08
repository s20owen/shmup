import Bullet from '../entities/Bullet.js';

export default class BulletPool {
  constructor(bulletImage) {
    this.pool = [];
    this.bulletImage = bulletImage;
  }

  get(x, y, angle) {
    let bullet = this.pool.find(b => !b.alive);
    if (!bullet) {
      bullet = new Bullet(x, y, angle, this.bulletImage);
      this.pool.push(bullet);
    } else {
      bullet.x = x;
      bullet.y = y;
      bullet.angle = angle;
      bullet.lifespan = 60;
      bullet.alive = true;
    }
    return bullet;
  }

  updateAll() {
    for (const bullet of this.pool) {
      if (bullet.alive) bullet.update();
    }
  }

  drawAll(ctx) {
    for (const bullet of this.pool) {
      if (bullet.alive) bullet.draw(ctx);
    }
  }

  getAllActive() {
    return this.pool.filter(b => b.alive);
  }
}
