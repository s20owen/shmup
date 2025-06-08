import Game from './engine/Game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Preload bullet image
const bulletImg = new Image();
bulletImg.src = './assets/bullets/bullet.png';

bulletImg.onload = () => {
  const game = new Game(canvas, ctx, bulletImg);
  game.start();
};
