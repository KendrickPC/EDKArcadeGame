// define 'game' variable and hold functions called to 'game' in engine.js 
var Game = function() {
    // initializing game variables    
    this.paused = false;
    this.gameOn = false;
    this.storyIndex = 0;
    this.storyTextIntro = [
        ['Score Touchdowns!',
        '',
        '',
        '1. Collect five gems each to increase',
        '   Player life by 1.',
        '2. Collect Red Heart and a add life.'],
        ['',
        '',
        '',
        '                       Game Over         ',
        '',
        '']
    ]
};



// Boolean (used in Enemy.update and Player.handleInput) that toggles between paused and un-paused game states by blocking updates
Game.prototype.togglePause = function() {
    this.paused = !this.paused;
}
// Increases one enemy at the end of successful run count through the player count variable
Game.prototype.addOneEnemy = function()  {
// Adding one more enemy is determined by summing up all current enemies and adding one more enemy to the next row. When all rows are filled, enemies will be added to the first row again.
  var rows = 4;
  var count = allEnemies.length + 1;
// Enemies loop  to the top if the count is > than rows available
  if(count > rows) {
    count -= rows;
  }
// Adding a new Enemy to the allEnemies array
  var enemy = new Enemy(-100, (count * 83) -21);
  allEnemies.push(enemy);
}

// Initializing the game asset variables - called during startup of the game
Game.prototype.gameReset=function(){
    // Place all enemy objects in an array called allEnemies
    allEnemies=[];
    for(var i=1; i<5; i++) {
        var enemy = new Enemy(0-1*101, 83*i-21);
        allEnemies.push(enemy);
    }
    // Create a gem offscreen and randomize its location. 
    // Does not use 'var' so gem is located on the global scope
    gem = new Gem(-100, -100);
    gem.reset();
    // storing main character object in a variable 'player'
    // Note: 'var' is not used so that player is stored in the global scope
    player = new Player(303, 380);
    // turns on game indicator
    this.gameOn = true;
};

// handleInput links to the keyboard during the introduction frame of the game; displays gameplay instructions on game board and starts the game. @param {String} key value of keypress is determined in the eventListener. 

Game.prototype.handleInput=function(key) {
    switch(key) {
      case 'spacebar':
        if (game.storyIndex < 0) {
            game.storyIndex++;
            game.speakerToggle();
        }   else {
            game.storyIndex = 1;
            document.getElementById('instructions').className='';
            game.gameReset();
        }
        break;
    }
};

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.rate = 100 + Math.floor(Math.random() * 150);
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update=function(dt) {
    if (!game.paused){
        this.x = this.x + (dt * this.rate);
    }

    // When an enemy goes offscreen, it reappears on the other side
    if (this.x > 680) {
        this.x = - Math.random() * 180;
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function(){
    this.x = 0 - Math.random() * 200;
};
// increaseRate to increase enemy speeds
Enemy.prototype.increaseRate = function() {
    this.rate += 50;
};

// Global scope variable of Player class
// This class requires an update(), render() and
// a handleInput() method - reset method added for touchdowns and score method added for point totals.
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.carryGem = false;
    this.playerLives = 5;
    this.greenGemScore = 0;
    this.orangeGemScore = 0;
    this.blueGemScore = 0;
    this.totalScore = 0;
    // resetScore needed for power ups
    this.resetScore = 0;
    // count needed to keep track of amount of touchdowns scored
    this.count = 0;
};

// updates score by counting gem points
Player.prototype.score = function () {
    if(gem.sprite === "images/Gem-Green.png") {
        this.greenGemScore++;
        gem.greenGemCount++;
        this.resetScore +=30;
    } else if(gem.sprite === "images/Gem-Orange.png") {
        this.orangeGemScore++;
        gem.orangeGemCount++;
        this.resetScore+=30;
    } else if(gem.sprite === "images/Gem-Blue.png") {
        this.blueGemScore++;
        gem.blueGemCount++;
        this.resetScore+=30;
    } else {
        this.playerLives++;
    }
}


// Reset main player to starting position
Player.prototype.reset = function() {
    // reset main player sprite
    if (this.y > 0 || (this.y < 0 && (!this.carryGem || !this.carryPowerUp))) {
        this.sprite = 'images/char-boy.png';
    }

    // If player is carrying the pigskin or powerup, set carryGem to false and carryPowerUp to false. Also, modify sprite name to main player carrying the pigskin.

    if (this.carryGem || this.carryPowerUp) {
        this.carryGem = false;
        this.carryPowerUp = false;
        this.sprite = 'images/char-boy.png'
    }
    // reset main character to initial location
    this.x = 303;
    this.y = 380;
};

/* Handle keyboard input during gameplay.
 * 'IF' statements verify movement will not allow the player outside the
 * canvas boundaries before the movement is calculated.
 * @param {String} key, the keyCode from the key pressed
 */
Player.prototype.handleInput = function(key) {

  // establish right boundary
  switch(key) {
    case 'up':
      if (this.y > 0 && !game.paused){
        this.y -= 83;
      }
      break;
    case 'down':
      if (this.y < 404 && !game.paused) {
        this.y += 83;
      }
      break;
    case 'left':
      if (this.x > 0 && !game.paused) {
        this.x -= 101;
      }
      break;
    case 'right':
      if (this.x < 556 && !game.paused){
        this.x += 101;
      }
      break;
    case 'pause':
      game.togglePause();
      break;
    case 'restart':
      game.gameReset();
      break;
  }
};

// Draw/render player onto screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create an images array of gems and hearts
gemImages = [
    'images/Gem-Green.png',
    'images/Gem-Orange.png',
    'images/Gem-Blue.png',
    'images/Heart.png'
];

// Defining Gem class
var Gem = function (x, y) {
    this.sprite = gemImages[Math.floor(Math.random() * 4)];
    this.x = x;
    this.y = y;
    this.visible = true;
    // Counts the green gems collected
    this.greenGemCount = 0;
    // Counts the orange gems collected
    this.orangeGemCount = 0;
    // Counts the blue gems collected
    this.blueGemCount = 0;
};

// Writing out code for when the main player picks up a Gem/Pigskin
Gem.prototype.pickup = function () {
    // setting parameters for gem objects
    this.visible = false;
    player.carryGem = true;
    // changes player's sprite image to show that a gem is being carried
    player.sprite = 'images/char-boy-w-bag.png';
    this.x = -101
    this.y = -101
};

// Drops the gem if enemy hits a player
Gem.prototype.drop = function() {
    this.visible = true;
    player.carryGem = false;
    this.x = player.x;
    this.y = player.y;
};

Gem.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = Math.ceil(Math.random() * 4) * 83 - 11;
    this.visible = true;
    this.sprite = gemImages[Math.floor(Math.random() * 4)];
};

Gem.prototype.hide = function() {
    this.visible = false;
    player.carryGem = false;
};

// Draw the Gem/Pigskin on the playingField
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// global scope 'game' variable that initializes my game, but can't be placed on the top of the file
game = new Game();

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
// eventListener 'keydown' allows the introscreen to scroll up when the spacebar is pressed
document.addEventListener('keydown', function(e) {
    var allowedKeys;
    if (!game.gameOn) {
        allowedKeys = {
            32: 'spacebar'
        };
        game.handleInput(allowedKeys[e.keyCode]);
    }   else {
        allowedKeys = {
            32: 'spacebar',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            80: 'pause',
            82: 'restart'
    };
    player.handleInput(allowedKeys[e.keyCode]);
        }
    if (e.keyCode in allowedKeys){
        e.preventDefault();
    }
});

//timeout method to update timer on canvas
  function timeout() {   
  var id = setInterval(frame, 30000);
  function frame() {
    if(powerup.timer > 0) {
      powerup.timer--;
    } else {
      clearInterval(id);
    }
  }
}
