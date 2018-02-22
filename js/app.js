// define 'game' variable and hold functions called to 'game' in engine.js 
var Game = function() {
    // initializing game variables    
    this.paused=false;
    this.gameOn=false;
    this.itemDisplayIndex=0;
    this.gameTextInstructions = [
        ['abcdefg','12345','abcdefg','12345','abcdefg','12345','abcdefg','12345','abcdefg','12345']
    ]
};

// global scope 'game' variable that initializes my game, but can't be placed on the top of the file
game = new Game();

// Boolean (used in Enemy.update and Player.handleInput) that toggles between paused and un-paused game states by blocking updates
Game.prototype.togglePause=function() {
    this.paused=!this.paused;
}
// Increases one enemy at the end of successful run count through the player count variable
Game.prototype.addOneEnemy=function()  {
// Adding one more enemy is determined by summing up all current enemies and adding one more enemy to the next row. When all rows are filled, enemies will be added to the first row again.
  var rows=4;
  var count=allEnemies.length+1;
// Enemies loop  to the top if the count is > than rows available
  if(count>rows) {
    count-=rows;
  }
// Adding a new Enemy to the allEnemies array
  var enemy=new Enemy(-100, (count*83)-21);
  allEnemies.push(enemy);
}

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.multiplier = Math.floor((Math.random() * 4) + 1);
    // console.log(this.multiplier);
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + 101 * dt * this.multiplier;

    if (this.y == player.y && (this.x > player.x - 20 && this.x < player.x + 20)) {
        // console.log('Collision Logic Successful!!!');
        player.reset();
    }

    // If the officer goes off screen, this if statement resets their position with a random multiplier
    if (this.x > 720) {
        this.multiplier = Math.floor((Math.random() * 4) + 1);
        this.reset();
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function(){
    this.x = -200;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
};

Player.prototype.handleInput = function(direction) {

    if (direction === 'up') {
        this.y = this.y - 80;

    } else if (direction === 'down') {
        this.y = this.y + 80;

    } else if (direction === 'left') {
        this.x = this.x - 101;

    } else if (direction === 'right') {
        this.x = this.x + 101;
    }

    if (this.x < 0 || this.x > 606) {
        this.reset();
    } else if (this.y < -20 || this.y > 404) {
        this.reset();
    }
};

Player.prototype.update = function() {
    this.x = this.x;
    this.y = this.y;
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
    this.x = 303;
    this.y = 380;
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var ladyBugYValues = [220, 140, 60];
for (var i = 0; i < 15; i++) {
    var x = Math.floor((Math.random() * -1000) + 1);
    var y = ladyBugYValues[Math.floor((Math.random() * 3))];
    enemy = new Enemy(x, y);
    allEnemies.push(enemy);
} 
player = new Player(303, 380);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
