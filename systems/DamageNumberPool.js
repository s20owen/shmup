import DamageNumber from './DamageNumber.js';

export default class DamageNumberPool {
  constructor() {
    this.pool = [];
  }

  get(x, y, text) {
    let d = this.pool.find(d => !d.alive);
    if (!d) {
      d = new DamageNumber(x, y, text);
      this.pool.push(d);
    } else {
      d.x = x;
      d.y = y;
      d.text = text;
      d.opacity = 1;
      d.lifespan = 40;
    }
    return d;
  }

  updateAll() {
    for (const d of this.pool) {
      if (d.alive) d.update();
    }
  }

  drawAll(ctx) {
    for (const d of this.pool) {
      if (d.alive) d.draw(ctx);
    }
  }
}
