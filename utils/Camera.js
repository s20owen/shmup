export default class Camera {
  constructor(target, screenWidth, screenHeight, worldWidth, worldHeight) {
    this.target = target;
    this.width = screenWidth;
    this.height = screenHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.x = 0;
    this.y = 0;
    this.shakeMagnitude = 0;
    this.shakeDuration = 0;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;

  }

  update() {
    this.x = Math.floor(this.target.x - this.width / 2);
    this.y = Math.floor(this.target.y - this.height / 2);
  
    this.x = Math.max(0, Math.min(this.x, this.worldWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.worldHeight - this.height));

    if (this.shakeDuration > 0) {
      this.shakeOffsetX = (Math.random() - 0.5) * this.shakeMagnitude;
      this.shakeOffsetY = (Math.random() - 0.5) * this.shakeMagnitude;
      this.shakeDuration--;
    } else {
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
    }
    
  }

  shake(magnitude = 10, duration = 10) {
    this.shakeMagnitude = magnitude;
    this.shakeDuration = duration;
  }
  
  
}
