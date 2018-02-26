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
    canvas.height = 606;
    document.getElementById('playingField').appendChild(canvas);
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
              if(gem.sprite === "images/Heart.png") {
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

        if(gem.sprite === "images/Heart.png") {
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
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 7,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
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

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
        
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
