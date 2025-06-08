export default class WaveManager {
    constructor(enemyPool, worldWidth, worldHeight) {
      this.enemyPool = enemyPool;
      this.worldWidth = worldWidth;
      this.worldHeight = worldHeight;
  
      this.wave = 0;
      this.timeUntilNextWave = 300; // 5 seconds
      this.enemiesToSpawn = 0;
      this.spawnInterval = 30;
      this.spawnTimer = 0;
    }
  
    update() {
      if (this.enemiesToSpawn > 0) {
        this.spawnTimer--;
        if (this.spawnTimer <= 0) {
          this.spawnTimer = this.spawnInterval;
    
          const [x, y] = this.getSpawnPosition();
    
          if (this.isBossWave && !this.bossSpawned) {
            this.enemyPool.get(x, y, true, this.spawnPowerup); // boss + powerup callback
            this.bossSpawned = true;
          } else {
            this.enemyPool.get(x, y, false, this.spawnPowerup); // normal enemy
            this.enemiesToSpawn--;
          }
        }
      } else {
        this.timeUntilNextWave--;
        if (this.timeUntilNextWave <= 0) {
          this.startNextWave();
        }
      }
    }
    
  
    getCountdownNumber() {
      const seconds = Math.ceil(this.timeUntilNextWave / 60);
      if (this.enemiesToSpawn > 0 || seconds <= 0) return null;
      return seconds;
    }
  
    startNextWave() {
      this.wave++;
      this.timeUntilNextWave = 300;
     // this.enemiesToSpawn = 2 + this.wave * 2; alot of enemies
     this.enemiesToSpawn = Math.floor(1 + this.wave * 1.5); // easier spawns
    
      // Boss wave every 7th wave
      if (this.wave % 7 === 0) {
        this.enemiesToSpawn++; // extra slot for boss
        this.isBossWave = true;
        this.bossSpawned = false;
      } else {
        this.isBossWave = false;
      }
    }
    
  
    getSpawnPosition() {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0: return [Math.random() * this.worldWidth, -100];
        case 1: return [this.worldWidth + 100, Math.random() * this.worldHeight];
        case 2: return [Math.random() * this.worldWidth, this.worldHeight + 100];
        case 3: return [-100, Math.random() * this.worldHeight];
      }
    }
  }
  