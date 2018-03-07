var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 707;
    // changed canvas.height from 585 to 656
    canvas.height = 655;
    document.getElementById('football-field').appendChild(canvas);
    // doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is)
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        // reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        if (game.gameOn) {
        updateEntities(dt);
        checkCollisions();
        updateScore();
        }
    }    
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    // collision check function
    function checkCollisions() {
    // Function checks for enemy collision
    // 10 pixel difference alignment of enemy and player
    // Y positions on the same row because sprites need centering
    // Function collisions detected when opposite sides of X coordinates are within 75 pixels.
    allEnemies.forEach(function(enemy)  {
        if(player.y - enemy.y == 10)  {
          if(player.x < enemy.x + 75 && player.x + 75 > enemy.x) {
            player.playerLives--;
            // dropping of Gem when player carrying
            if(player.carryGem) {
              if(gem.sprite === "images/ballHeart.png") {
              gem.reset();
              } else {
                gem.drop();
              }
            }
            player.reset();
            } 
          }
        });

        // Check for collision between player and the game, and take gem. 
        if(player.y === gem.y && player.x === gem.x) {
            gem.pickup();
        }
      }
    // updateScore function when gems are collected
    function updateScore() {
        if (player.playerLives === 0) {
            gameOver();
            }

        if(player.y < 0 && (player.carryGem || player.carryPowerUp))  {
            // update player gem score
            player.score();

            if(gem.greenGemCount === 5){
                player.playerLives++;
                gem.greenGemCount = 0;
            }  
            else if(gem.orangeGemCount === 5) {
                player.playerLives++;
                game.orangeGemCount = 0;
            }
            else if(gem.blueGemCount === 5) {
                player.playerLives++;
                gem.blueGemCount = 0;
            }

        if(gem.sprite === "images/ballHeart.png") {
            player.totalScore += 0;
            }
        else {
            player.totalScore += 30;
            }
        // adding 1 into player count to add an enemy
        player.count++;
        // reset the player at the initial position after it reaches the touchdown zone
        player.reset();
        // reset the gem when it reaches the touchdown zone
        gem.reset();
        // speed increase for enemies
        if(allEnemies.rate <= 200){
            allEnemies.forEach(function(enemy) {
                enemy.increaseRate();
                });
            };
        // add enemies until allEnemies.length < 8
        if(player.count === allEnemies.length && allEnemies.length < 8) {
            game.addAnEnemy();
            }
        }
    }

    // gameOver function resets the game to the beginning
    function gameOver() {
        allEnemies = [];
        gem.hide();
        game.gameOn = false;
    }


    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        // topRowTiles array to render touchdown zone
        var topRowTiles = [
            'images/wood-block.png',
            'images/wood-block.png',
            'images/wood-block.png',
            'images/wood-block.png',
            'images/wood-block.png',
            'images/wood-block.png',
            'images/wood-block.png'
        ];
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/wood-block.png',    // Top row is wood
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/stone-block.png',   // Row 1 of 2 of stone
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 7,
            row, col;

        // Loop through columns to draw the touchdown zone
        for (col = 0; col < numCols; col++) {
            ctx.drawImage(Resources.get(topRowTiles[col]), col * 101, -50);
            ctx.drawImage(Resources.get(topRowTiles[col]), col * 101, 0);
        }

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */

        for (row = 1; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        // if the game is on the introduction screen, render intro entities. Otherwise, render the playingField entities.
        if (!game.gameOn) {
            renderIntro();
        }   else {
            renderEntities();
        }
    }

    // The function below draws the introduction and gameOver scene.  
    function renderIntro() {
        bubbleRect(125,160,460,240,25,10,'#fff','#000');
        renderStory();
    }

    // The following function takes code from the itemDisplayIndex array in the app.js file - renders the text in the story bbuble above. helpText is rendered at the bottom of screen to indicate the spacebar key function.
    function renderStory () {
      ctx.font = '12pt Helvetica';
      ctx.fillStyle = '#000';
      for (var i=0; i < game.beginningTextIntro[game.itemDisplayIndex].length; i++){
        ctx.fillText(game.beginningTextIntro[game.itemDisplayIndex][i],150,207 + i * 25);
      }
      ctx.strokeStyle = '#fff';

      var helpText = 'Press Spacebar to continue';
      if (game.itemDisplayIndex < 1){
        helpText = 'Press Spacebar to continue';
      } else {
        helpText = 'Press Spacebar to play again';
      }
      ctx.lineWidth = 5;
      ctx.strokeText(helpText,225,515);
      ctx.fillText(helpText,225,515);
    }


    /**
     * Draws a rounded rectangle using the current state of the canvas. 
     * If you omit the last three params, it will draw a rectangle 
     * outline with a 5 pixel border radius 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate 
     * @param {Number} width The width of the rectangle 
     * @param {Number} height The height of the rectangle
     * @param {Number} radius The corner radius. Defaults to 5;
     * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
     * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
     */

    // The bubbleRect() function was taken from the following links: 
    // http://js-bits.blogspot.tw/2010/07/canvas-rounded-corner-rectangles.html
    // http://www.html5.jp/canvas/ref/method/quadraticCurveTo.html

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */

    function bubbleRect(x, y, width, height, radius, lineWidth, fill, stroke) {
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    }


    function renderEntities() {
        // render a gem if player is not holding a gem (gem.visible = true)
        if(gem.visible) {
            gem.render();
        }
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        // renders main player
        player.render();
        // renders a score row
        renderScoringRow();
    }
    // This function below is called on with renderEntities function.
    function renderScoringRow() {
        // array for holding gems/pigskins and hearts
        var scoreGemImage = [
            'images/scoreGreen.png',
            'images/scoreOrange.png',
            'images/scoreBlue.png',
            'images/scoreHeart.png',
        ];

    // drawing images of gems above the touchdown zone
    for (var col = 0; col < 4; col++) {
        ctx.drawImage(Resources.get(scoreGemImage[col]), (col * 202) + 10, -20);
    }

    // scoreNum array to hold main player's gem/pigskin variable
    var scoreNum = [player.greenGemScore, player.orangeGemScore, player.blueGemScore, player.playerLives]

    // gemName is an array to hold gem/pigskin name and player life
    var gemName = ['      Green', '     Orange', '        Blue', '    Player Life']

    // text for gem score and gem name on board
    for(var i = 0; i < 4; i++) {
        ctx.lineWidth = 5;
        ctx.strokeText(scoreNum[i], (i * 200) + 45, 65);
        ctx.fillText(scoreNum[i], (i * 200) + 45, 65);
        ctx.strokeText(gemName[i], (i * 200), 20);
        ctx.fillText(gemName[i], (i * 200), 20);
    }
    // text for main player's total score on football-field
    ctx.lineWidth = 5;
    ctx.strokeText('Player Score: ' + player.totalScore, 402, 575);
    ctx.fillText('Player Score: ' + player.totalScore, 402, 575);
    }
    // above is the end of the renderScoringRow function

    /* Loads all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
  Resources.load([
    'images/footballPlayer.png',
    'images/footballPlayerWithBall.png',
    'images/defender.png',
    'images/stone-block.png',
    'images/wood-block.png',
    'images/grass-block.png',
    'images/ballBlue.png',
    'images/ballGreen.png',
    'images/ballOrange.png',
    'images/ballHeart.png',
    'images/scoreGreen.png',
    'images/scoreOrange.png',
    'images/scoreBlue.png',
    'images/scoreHeart.png',
  ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
