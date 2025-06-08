import Enemy from '../entities/Enemy.js';

export default class EnemyPool {
  constructor(player) {
    this.pool = [];
    this.player = player;
  }

  get(x, y, isBoss = false, spawnPowerupCallback = null) {
    let enemy = this.pool.find(e => !e.alive);
    if (!enemy) {
      enemy = new Enemy(0, 0, this.player);
      this.pool.push(enemy); // Only push new ones
    }
    enemy.reset(x, y, isBoss, spawnPowerupCallback);
    return enemy;
  }
  
  

  updateAll() {
    for (const enemy of this.pool) {
      if (enemy.alive) enemy.update();
    }
  }

  drawAll(ctx) {
    for (const enemy of this.pool) {
      if (enemy.alive) enemy.draw(ctx);
    }
  }

  getAllActive() {
    return this.pool.filter(e => e.alive);
  }
}
