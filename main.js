import Game from './engine/Game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let game; // <-- make it accessible everywhere

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
  game = new Game(canvas, ctx, bulletImg); // now shared
};

document.getElementById('singleBtn').onclick = () => {
  document.getElementById('modeSelect').style.display = 'none';
  game.mode = 'single';
  game.start();
};

document.getElementById('coopBtn').onclick = () => {
  document.getElementById('modeSelect').style.display = 'none';
  game.mode = 'coop';
  game.start();
};
