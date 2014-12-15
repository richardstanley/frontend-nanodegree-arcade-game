// Entity is the superclass for all subsequent subclassed entities.
// All Entity subclasses will have a default image of the 'Selector.png',
// x and y positions set to 700 and 700 (i.e. offscreen), a method render() 
// which renders the sprite, and a overlap test method.  Its up to the 
// subclassed entities to change these defaults as needed.
var Entity = function( ) {
    this.sprite = 'images/Selector.png';
	this.x = 700;
	this.y = 700;
}

// This method draws the entity on the screen.
Entity.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// This method tests if the object overlaps another.
Entity.prototype.testOverlap = function (obj) {
    
    if (obj.x <= this.x + 25 && obj.x >= this.x - 25 &&
    	obj.y <= this.y + 25 && obj.y >= this.y - 25) {
    	return true;
    }
    else {
    	return false;
    }
}

// The Enemy class is a subclass the Entity class. 
var Enemy = function(yPosition) {
    Entity.call(this);
    
    this.sprite = 'images/enemy-bug.png';
    this.x = Math.floor(Math.random() * 400);
    this.y = yPosition;
    
    this.speed = Math.floor((Math.random()*200) + 100);
}
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// This updates the enemy's position according to its
// randomly set speed.  The parameter dt is a time delta
// tick that allows the game to have consistent game play
// across different computers.  See engine.js for more
// details about the dt parameter.
// This method also determines if enemy captures player.
Enemy.prototype.update = function(dt) {
	this.x += this.speed*dt;
	
	if (this.x > 520) {
		this.x = -2;
	}
    
    if (this.testOverlap(player)){
    	player.captured ();
    }

}

// This Player class is a subclass of the Entity class.  It sets
// the start position.
var Player = function() {
    Entity.call(this);
    
    this.sprite ='images/char-boy.png';
	this.relocate();
    
    this.starsCollected = 0;
    
}
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

// Relocates the player to the starting position.
Player.prototype.relocate = function () {
    this.x = 200;
    this.y = 400;
}

// This method tests if the player made it to the water and if a player
// collects a star.
Player.prototype.update = function () {
	if(this.y < 25){
		this.succeeds();
	}
    
    if (this.testOverlap(star)) {
		star.collected();
    }
}

// This method should execute if the player successfully reaches
// the water row.
Player.prototype.succeeds = function () {
	this.relocate();
	star.relocate();
	rock.relocate();
	
	if (this.starsCollected < 1) {
		alert('Congratulations!  Try to collect some stars next time.');
	}
	else if (this.starsCollected === 1) {
		alert('Congratulations!  You collected a star!  Try to get more!');
	}
	else {
		alert('Congratulations!  You collected ' + this.starsCollected + ' stars!');
	}

}

// This method should execute if the player is captured by
// an enemy object.
Player.prototype.captured = function() {
	this.relocate();
	star.relocate();
		
	if (this.starsCollected < 1) {
		alert('Captured!  Move faster next time!');
	}
	else {
		alert('Captured!  You lost all your stars!');
	}
	
	this.starsCollected = 0;
	rock.relocate();	
}


// This method takes the users direction input and moves the 
// player object across the canvas accordingly without leaving
// the edges or hitting a rock.
// The player's moveIncrement is set depending on how many stars
// were collected.
Player.prototype.handleInput = function (enteredKey) {
	var moveIncrement = 50;
		
	if (this.starsCollected > 5){
		moveIncrement = 25;
	}
	
	switch (enteredKey) {
		case 'left': 
			if (this.x > 10) 
				{this.x -= moveIncrement};
			break;
		case 'right': 
			if (this.x < 400) 
				{this.x += moveIncrement};
			break;
		case 'up': 
			if (this.y > 10 && !rock.testUpBlocked(this)) 
				{this.y -= moveIncrement};
			break;
		case 'down': 
			if (this.y < 400) 
				{ this.y += moveIncrement};
			break;
		default:
	}
}

// The Star class is a subclass of the superclass Entity. 
var Star = function(){
    Entity.call(this);
    
    this.sprite = 'images/Star.png';
}
Star.prototype = Object.create(Entity.prototype);
Star.prototype.constructor = Star;

// This method is executed if a player collects the star object.
Star.prototype.collected = function () {
    this.x = 700;
    this.y = 700;

    player.starsCollected++;

	if (player.starsCollected === 6) {
		alert('All these stars are weighing you down and its getting harder to move!');
	}
}

// Relocates star object to random location.
Star.prototype.relocate = function () {
	this.x = Math.floor(Math.random()*400);
	this.y = Math.floor((Math.random()*150) + 70);
}

// The Rock class is a subclass of the superclass Entity. 
var Rock = function(){
    Entity.call(this);
    
    this.sprite = 'images/Rock.png';
    this.y = -16;
}
Rock.prototype = Object.create(Entity.prototype);
Rock.prototype.constructor = Rock;

// Relocates the rock depending on the number of stars
// collected and the star object location.
Rock.prototype.relocate = function() {
	if(player.starsCollected < 1) {
		this.x = 700;
	}
	
	if(player.starsCollected > 2) {
		this.x = star.x;
	}
}

// Tests if the rock is blocking the up direction.
Rock.prototype.testUpBlocked = function(obj) {

	if (obj.y < this.y + 70 
		&& obj.x < rock.x + 50 && obj.x > this.x - 50) {
		return true;
	}
	
	return false;
}

// Instantiates the allEnemies array with 4 Enemy objects
// spaced 50 apart in the y position.
var allEnemies = [];
for (var i = 0; i < 4 ; i++){
	allEnemies[i] = new Enemy (60 + 50 * i);
}

//Instantiates the player object.
var player = new Player();

// Instantiates the star object.  
var	star = new Star();

//Instantiates the rock object.
var rock = new Rock();


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
