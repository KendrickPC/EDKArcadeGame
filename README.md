Object Oriented JavaScript || Every Day Kenneth's Remix

 First, we start with our app.js file to make the game board appear. To do so, we must first build our enemy class with the variables X and Y by applying them to each of our instances. 

var Enemy = function(x,y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
};

