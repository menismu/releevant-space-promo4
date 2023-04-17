/**
 * Variables used during the game.
 */
let player;
let enemy;
let cursors;
let background;
let backgroundSecond;
let spaceBar;
let bullets = [];
let elapsedFrames = 0;

/**
 * It prelaods all the assets required in the game.
 */
function preload() {
  this.load.image("sky", "assets/backgrounds/blue.png");
  this.load.image("player", "assets/characters/player.png");
  this.load.image("enemy1", "assets/characters/alien1.png");
  this.load.image("enemy2", "assets/characters/alien2.png");
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
  enemy = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT, "enemy1");
  enemy.setX((SCREEN_WIDTH - enemy.width * ENEMY_SCALE) / 2);
  enemy.setY((enemy.height * ENEMY_SCALE) / 2);
  enemy.setScale(ENEMY_SCALE);

  //cursors map into game engine
  cursors = this.input.keyboard.createCursorKeys();

  spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

/**
 * Updates each game object of the scene.
 */
function update() {
  elapsedFrames++;

  // mover player con cursores
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
    bullets.push(this.add.ellipse(player.x, player.y - player.height / 2 * PLAYER_SCALE, 5, 10, 0xf5400a));
    
    elapsedFrames = 0;
  }

  // mover balas
  for (const bullet of bullets) {
    bullet.setY(bullet.y - BULLET_VELOCITY);
  }

  // mover enemigo
  enemy.setY(enemy.y + ENEMY_VELOCITY);
  enemy.setX(enemy.x + (player.x >= enemy.x ? 1 : -1) * ENEMY_VELOCITY);

  if (enemy.y > SCREEN_HEIGHT + enemy.height / 2 * ENEMY_SCALE) {
    enemy.destroy();

    enemy = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT, "enemy1");
    enemy.setX((SCREEN_WIDTH - enemy.width * ENEMY_SCALE) / 2);
    enemy.setY((enemy.height * ENEMY_SCALE) / 2 - enemy.height / 2);
    enemy.setScale(ENEMY_SCALE);
  }

  // mover fondo
  backgroundSecond.setY(backgroundSecond.y + 1);  
  background.setY(background.y + 1);

  if (background.y >= (SCREEN_HEIGHT / 2 + background.height)) {
    background.setY(backgroundSecond.y - background.height);

    const backgroundCopy = background;
    background = backgroundSecond;
    backgroundSecond = backgroundCopy;
  }
}