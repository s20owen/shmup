export default class InputManager {
  constructor() {
    this.keys = {};
    this.moveVector = { x: 0, y: 0 };
    this.aimVector = { x: 0, y: 0 };
    this.shooting = false;
    this.moveTouchId = null;
    this.aimTouchId = null;

    this.p2Keys = {};
    this.p2MoveVector = { x: 0, y: 0 };
    this.p2Shooting = false;


    // Mouse and keyboard
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    
      // Player 2 input
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        this.p2Keys[e.key.toLowerCase()] = true;
      }
      if (e.key === ' ') {
        this.p2Shooting = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.p2Keys[e.key.toLowerCase()] = false;
      if (e.key === ' ') {
        this.p2Shooting = false;
      }
    });
    window.addEventListener('mousedown', () => this.shooting = true);
    window.addEventListener('mouseup', () => this.shooting = false);
    window.addEventListener('mousemove', (e) => {
      const rect = document.getElementById('gameCanvas').getBoundingClientRect();
      this.aimVector = {
        x: e.clientX - rect.width / 2,
        y: e.clientY - rect.height / 2
      };
    });

    this.setupJoystick('joystick-left', 'move');
    this.setupJoystick('joystick-right', 'aim');
  }

  update() {
    if (!this.usingTouch) {
      // Player 1
      let x = 0, y = 0;
      if (this.keys['w']) y -= 1;
      if (this.keys['s']) y += 1;
      if (this.keys['a']) x -= 1;
      if (this.keys['d']) x += 1;
      const len1 = Math.hypot(x, y);
      this.moveVector = len1 ? { x: x / len1, y: y / len1 } : { x: 0, y: 0 };
  
      // Player 2
      let x2 = 0, y2 = 0;
      if (this.p2Keys['arrowup']) y2 -= 1;
      if (this.p2Keys['arrowdown']) y2 += 1;
      if (this.p2Keys['arrowleft']) x2 -= 1;
      if (this.p2Keys['arrowright']) x2 += 1;
      const len2 = Math.hypot(x2, y2);
      this.p2MoveVector = len2 ? { x: x2 / len2, y: y2 / len2 } : { x: 0, y: 0 };
    }
  }

  setupJoystick(id, type) {
    const stick = document.getElementById(id);
    if (!stick) return;
  
    const toggle = document.getElementById('toggleJoystick');
    if (!toggle) return;
  
    const getTouchById = (touches, id) => {
      for (const touch of touches) {
        if (touch.identifier === id) return touch;
      }
      return null;
    };
  
    const onTouchStart = (e) => {
      if (!toggle.checked) return;
      this.usingTouch = true;
  
      for (const touch of e.changedTouches) {
        const rect = stick.getBoundingClientRect();
        const x = touch.clientX - rect.left - rect.width / 2;
        const y = touch.clientY - rect.top - rect.height / 2;
        const dist = Math.hypot(x, y);
  
        if (dist < rect.width / 2) {
          if (type === 'move' && this.moveTouchId === null) {
            this.moveTouchId = touch.identifier;
            updateStickVec(x, y, type);
          } else if (type === 'aim' && this.aimTouchId === null) {
            this.aimTouchId = touch.identifier;
            updateStickVec(x, y, type);
            this.shooting = true;
          }
        }
      }
    };
  
    const onTouchMove = (e) => {
      if (!toggle.checked) return;
  
      let targetTouch = null;
      if (type === 'move') {
        targetTouch = getTouchById(e.touches, this.moveTouchId);
      } else if (type === 'aim') {
        targetTouch = getTouchById(e.touches, this.aimTouchId);
      }
  
      if (targetTouch) {
        const rect = stick.getBoundingClientRect();
        const x = targetTouch.clientX - rect.left - rect.width / 2;
        const y = targetTouch.clientY - rect.top - rect.height / 2;
        updateStickVec(x, y, type);
      }
    };
  
    const onTouchEnd = (e) => {
      for (const touch of e.changedTouches) {
        if (type === 'move' && touch.identifier === this.moveTouchId) {
          this.moveVector = { x: 0, y: 0 };
          this.moveTouchId = null;
        }
        if (type === 'aim' && touch.identifier === this.aimTouchId) {
          this.aimVector = { x: 0, y: 0 };
          this.aimTouchId = null;
          this.shooting = false;
        }
      }
    };
  
    const updateStickVec = (x, y, type) => {
      const len = Math.hypot(x, y);
      const vec = len ? { x: x / len, y: y / len } : { x: 0, y: 0 };
  
      if (type === 'move') this.moveVector = vec;
      if (type === 'aim') this.aimVector = vec;
    };
  
    stick.addEventListener('touchstart', onTouchStart);
    stick.addEventListener('touchmove', onTouchMove);
    stick.addEventListener('touchend', onTouchEnd);
  }
  
  
}
