export default class AchievementManager {
    constructor(game) {
      this.game = game;
  
      this.achievements = [
        { key: 'slayer', label: '🔫 Slayer: Kill 100 enemies', condition: () => game.enemiesKilled >= 100 },
        { key: 'bossSlayer', label: '👑 Boss Slayer: Defeat 5 bosses', condition: () => game.bossesKilled >= 5 },
        { key: 'survivor', label: '💪 Survivor: Reach wave 10', condition: () => game.waveManager.wave >= 10 },
        { key: 'upgraded', label: '🚀 Fully Upgraded: Collect weapon-upgrade', condition: () => game.player.upgraded },
        { key: 'speedDemon', label: '⚡ Speed Demon: Stack 3 speed boosts', condition: () => game.player.speedBoosts >= 3 },
      ];
  
      this.unlocked = new Set(JSON.parse(localStorage.getItem('achievements') || '[]'));
    }
  
    update() {
      for (const a of this.achievements) {
        if (!this.unlocked.has(a.key) && a.condition()) {
          this.unlocked.add(a.key);
          console.log(`🏆 Achievement Unlocked: ${a.label}`);
          // You can add visual feedback here
          if (!this.unlocked.has(a.key) && a.condition()) {
            this.unlocked.add(a.key);
            localStorage.setItem('achievements', JSON.stringify([...this.unlocked]));
            this.game.showAchievementBanner(`🏆 Achievement Unlocked: ${a.label}`);
          }
        }
      }
  
      // Save unlocked achievements
      localStorage.setItem('achievements', JSON.stringify([...this.unlocked]));
    }
  
    getUnlocked() {
      return [...this.unlocked];
    }
  }
  