/**
 * Variables used during the game.
 */
let player;
let enemy = [];
let cursors;
let background;
let backgroundSecond;
let spaceBar;
let bullets = [];
let elapsedFrames = 0;
let explosion;

/**
 * It prelaods all the assets required in the game.
 */
function preload() {
  this.load.image("sky", "assets/backgrounds/blue.png");
  this.load.image("player", "assets/characters/player.png");
  this.load.image("enemy1", "assets/characters/alien1.png");
  this.load.image("enemy2", "assets/characters/alien2.png");
  this.load.image("red", "assets/particles/red.png");
}

/**
 * It creates the scene and place the game objects.
 */
function create() {
  // scene background
  background = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "sky");
  backgroundSecond = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "sky");
  backgroundSecond.setY(background.y - backgroundSecond.height);

  // playet setup
  player = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT, "player");
  player.setX((SCREEN_WIDTH - player.width * PLAYER_SCALE) / 2);
  player.setY(SCREEN_HEIGHT - (player.height * PLAYER_SCALE) / 2);
  player.setScale(PLAYER_SCALE);

  // enemy setup
  regenerarEnemigos(this);

  //cursors map into game engine
  cursors = this.input.keyboard.createCursorKeys();

  spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  explosion = this.add.particles("red").createEmitter({
    scale: { min: 0.5, max: 0 },
    speed: { min: -100, max: 100 },
    quantity: 10,
    frequency: 0.1,
    lifespan: 200,
    gravityY: 0,
    on: false
  });
}

/**
 * Updates each game object of the scene.
 */
function update() {
  elapsedFrames++;

  moverPlayer(this);
  moverBalas(this);
  moverEnemigos(this);
  moverFondo();
}

/**
 * Mover player con cursores 
 */
function moverPlayer(engine) {
  if (cursors.left.isDown && player.x > player.width / 2 * PLAYER_SCALE) {
    player.setX(player.x - PLAYER_VELOCITY);
  } else if (cursors.right.isDown && player.x < SCREEN_WIDTH - player.width / 2 * PLAYER_SCALE) {
    player.setX(player.x + PLAYER_VELOCITY);
  }

  if (cursors.up.isDown && player.y > player.height / 2 * PLAYER_SCALE) {
    player.setY(player.y - PLAYER_VELOCITY);
  } else if (cursors.down.isDown && player.y < SCREEN_HEIGHT - player.height / 2 * PLAYER_SCALE) {
    player.setY(player.y + PLAYER_VELOCITY);
  }

  if (spaceBar.isDown && elapsedFrames > 20) {
    bullets.push(engine.add.ellipse(player.x, player.y - player.height / 2 * PLAYER_SCALE, 5, 10, 0xf5400a));
    
    elapsedFrames = 0;
  }
}

/**
 * Mover balas. 
 */
function moverBalas(engine) {
  for (const bullet of bullets) {
    bullet.setY(bullet.y - BULLET_VELOCITY);

    for (const e of enemy) {
      if ((bullet.x - bullet.width / 2) > (e.x - e.width / 2 * ENEMY_SCALE) 
          && (bullet.x + bullet.width / 2) < (e.x + e.width / 2 * ENEMY_SCALE)
          && (bullet.y - bullet.height / 2) > (e.y - e.height / 2 * ENEMY_SCALE)
          && (bullet.y + bullet.height / 2) < (e.y + e.height / 2 * ENEMY_SCALE)) {
        bullet.destroy();
        e.destroy();

        explosion.setPosition(e.x, e.y);
        explosion.explode();

        bullets.splice(bullets.indexOf(bullet), 1);
        enemy.splice(enemy.indexOf(e), 1);
      }
    }
  }

  if (enemy.length == 0) {
    regenerarEnemigos(engine);
  }
}

/**
 * Regenerar enemigos. 
 */
function regenerarEnemigos(engine) {
  const numEnemigos = [1, 3, 5];
  const numPosicion = Math.floor(Math.random() * 3);

  for (let i = -numEnemigos[numPosicion] / 2; i < numEnemigos[numPosicion] / 2; i++) {
    const e = engine.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT, "enemy1");
    e.setX((SCREEN_WIDTH - e.width * ENEMY_SCALE) / 2 + i * 2 * e.width * ENEMY_SCALE);
    e.setY((e.height * ENEMY_SCALE) / 2 - e.height / 2);
    e.setScale(ENEMY_SCALE);

    enemy.push(e);
  }
}

/**
 * Mover enemigos. 
 */
function moverEnemigos(engine) {
  if (enemy.length == 1) {
    enemy[0].setX(enemy[0].x + (player.x >= enemy[0].x ? 1 : -1) * ENEMY_VELOCITY);
  }
  for (const e of enemy) {
    e.setY(e.y + ENEMY_VELOCITY);

    if (e.y > SCREEN_HEIGHT + e.height / 2 * ENEMY_SCALE) {
      e.destroy();

      regenerarEnemigos(engine);
    }
  }
}

/**
 * Mover fondo.
 */
function moverFondo() {
  backgroundSecond.setY(backgroundSecond.y + 1);  
  background.setY(background.y + 1);

  if (background.y >= (SCREEN_HEIGHT / 2 + background.height)) {
    background.setY(backgroundSecond.y - background.height);

    const backgroundCopy = background;
    background = backgroundSecond;
    backgroundSecond = backgroundCopy;
  }
}