// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.setAttribute("id", "canvas");
var gameArea = document.getElementById('gameArea');
gameArea.appendChild(canvas);

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

//Study this stuff
function resizeGame() {
    var widthToHeight = 4 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }
    
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    canvas.width = newWidth;
    canvas.height = newHeight;
	
	reset();
}

//Images
var bgImage = new Image();
bgImage.ready = false;
bgImage.onload = setAssetReady;
bgImage.src = "images/Background/sky.png";

var playerImage = new Image();
playerImage.ready = false;
playerImage.onload = setAssetReady;
playerImage.src = "images/SwimmyFish/SwimmyFish.png";

var pipesImage = new Image();
pipesImage.ready = false;
pipesImage.onload = setAssetReady;
pipesImage.src = "images/Pipe/pipes.png";

var cloudImage = new Image();
cloudImage.ready = false;
cloudImage.onload = setAssetReady;
cloudImage.src = "images/Background/cloud.png";

var waterImage = new Image();
waterImage.ready = false;
waterImage.onload = setAssetReady;
waterImage.src = "images/Background/water.png";

var titleImage = new Image();
titleImage.ready = false;
titleImage.onload = setAssetReady;
titleImage.src = "images/GUI/Title.png";

var gameOverImage = new Image();
gameOverImage.ready = false;
gameOverImage.onload = setAssetReady;
gameOverImage.src = "images/GUI/GameOver.png";

function setAssetReady() {
	this.ready = true;
}


function Water() {
	this.minHeight = canvas.height/6;
	this.maxHeight = canvas.height/4;
	this.width = canvas.width * 1.5;
	this.minX = 0 - canvas.width/5;
	this.maxX = 0;
	this.speed = canvas.width/6;
	this.curHeight = this.minHeight;
	this.curX = this.minX;
	this.curY = canvas.height - this.minHeight;
	this.curSpeed = this.speed;
	this.move = function(modifier) {
		if((this.curSpeed > 0) && (this.curX > this.maxX)) {
			this.curSpeed = -this.speed; 
		}
		if((this.curSpeed < 0) && (this.curX < this.minX)) {
			this.curSpeed = this.speed; 
		}
		
		this.curX += this.curSpeed * modifier;
	}
	this.draw = function() {
		if(waterImage.ready) {
			if(this.curSpeed < 0) {
				ctx.drawImage(waterImage, 0, 0, 600, 150, this.curX, this.curY, canvas.width * 1.3, this.curHeight);
			} else {
				ctx.drawImage(waterImage, 600, 0, 600, 150, this.curX, this.curY, canvas.width * 1.3, this.curHeight);
			}
		}
	}
};

//Cloud object
function Cloud() {
	this.exists = false;
	this.randomize = function() {
		this.speed = canvas.width/5 + Math.floor(Math.random() * canvas.width/6);
		this.size = Math.floor(Math.random() * canvas.height/16) + canvas.height/9;
		if(Math.floor(Math.random() * 2) == 0) {
			this.x = canvas.width + this.size;
			this.curSpeed = -this.speed;
		} else {
			this.x = 0 - this.size * 2;
			this.curSpeed = this.speed;
		}
		this.y = Math.floor(Math.random() * canvas.height * 2 / 3);
	}
	
	this.draw = function() {
		if(cloudImage.ready) {
			ctx.drawImage(cloudImage, this.x, this.y, this.size * 1.5, this.size);
		}
	}
	this.move = function(modifier) {
		if(this.exists) {
			this.x += this.curSpeed * modifier;
		} else {
			this.randomize();
			this.exists = true;
		}
		
		if(this.curSpeed < 0) {
			if(this.x + this.size * 2 < 0) {
				this.exists = false;
				this.curSpeed = 0;
			}
		} else {
			if(this.x - this.size > canvas.width) {
				this.exists = false;
				this.curSpeed = 0;
			}
		}
	}
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
	if(title == true) {
		title = false;
		score = 0;
	}
	if(fish.alive == false) {
		reset();
	}

}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


var reset = function () {
	title = true;
	if(score > highScore) {
		highScore = score;
	}
	score = highScore;
	gameOver = false;
	fish = {
		alive: true,
		curSpeed: 0,
		maxSpeed: canvas.width/1.5,
		size: canvas.width/12,
		x: canvas.width/2,
		y: canvas.height - canvas.height/5
	};
	pipes = {
		y: 0,
		speed: canvas.height/1.5,
		height: canvas.height/12,
		gapX: Math.random() * (canvas.width - canvas.width/12),
		gapLength: canvas.width/5,
		exist: false,
		scored: false
	};

	
	left = false;
	right = false;
	cloud1 = new Cloud();
	cloud2 = new Cloud();
	water = new Water();
};

var left = false;
var right = false;

var fishMove = function(modifier) {
	if(left) {
		fish.curSpeed -= canvas.width/50;
	}
	if(right) {
		fish.curSpeed += canvas.width/50;
	}
	
	if(fish.curSpeed > fish.maxSpeed)
	{
		fish.curSpeed = fish.maxSpeed;
	}	
	if(fish.curSpeed < -fish.maxSpeed)
	{
		fish.curSpeed = -fish.maxSpeed;
	}
	
	fish.x += fish.curSpeed * modifier;

	if(fish.x + fish.size > canvas.width) {
		fish.x = canvas.width - fish.size;
		fish.curSpeed = 0;
	}
	
	if(fish.x < 0) {
		fish.x = 0
		fish.curSpeed = 0;
	}
	
	if(gameOver) {
		fish.y += fish.maxSpeed * modifier;
		if(fish.y > canvas.height) {
			fish.alive = false;
		}
	}
}

var pipeMove = function(modifier) {
	if(pipes.exist) {
		pipes.y += pipes.speed * modifier;
	} else {
		pipes.gapX = Math.random() * (canvas.width - fish.size);
		pipes.y = 0 - pipes.height;
		pipes.exist = true;
		pipes.scored = false;
	}
	
	if(pipes.y > canvas.height + pipes.height) {
		pipes.exist = false;
	}
};

var cloud1 = new Cloud();
var cloud2 = new Cloud();

var water = new Water();

var gameOver = false;
var title = true;
var highScore = 0;

// Update game objects
var update = function (modifier) {
	if(37 in keysDown) {
		left = true;
		right = false;
	}
	else if(39 in keysDown)	{
		left = false
		right = true;
	}
	if(!title) {
		if(!gameOver) {
			pipeMove(modifier);
		}
		fishMove(modifier);
	}
	cloud1.move(modifier);
	cloud2.move(modifier);
	water.move(modifier);
	checkSafe();
};

var score = highScore;

var checkSafe = function() {
	if(pipes.y + pipes.height/2 < fish.y + fish.size && pipes.y + pipes.height/2 > fish.y) {
		if(fish.x > pipes.gapX && fish.x + fish.size < pipes.gapX + pipes.gapLength) {
			if(!pipes.scored) {
				score ++;
				pipes.scored = true;
			}
		} else {
			gameOver = true;
		}
	}
}

// Draw everything
var render = function () {
    if (bgImage.ready) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }
	
	if(playerImage.ready) {
		if(left) {
			ctx.drawImage(playerImage, 0, 0, 64, 64, fish.x, fish.y, fish.size, fish.size);
		} else {
			ctx.drawImage(playerImage, 64, 0, 64, 64, fish.x, fish.y, fish.size, fish.size);
		}
	}
	
	cloud1.draw();
	cloud2.draw();

	
	if(pipes.exist) {
		if(pipesImage.ready) {
			ctx.drawImage(pipesImage, 0, 0, 1600, 50, pipes.gapX - canvas.width * 2, pipes.y, canvas.width * 2, pipes.height);
			ctx.drawImage(pipesImage, 1600, 0, 1600, 50, pipes.gapX + pipes.gapLength, pipes.y, canvas.width * 2, pipes.height);
		}
	}

	water.draw();
	
	if(title == true) {
		if(titleImage.ready) {
			ctx.drawImage(titleImage, canvas.width/2 - canvas.width/2, canvas.height/2 - canvas.height/2, canvas.width, canvas.height);
		}
	}
	
	if(gameOver == true) {
		if(gameOverImage.ready) {
			ctx.drawImage(gameOverImage, canvas.width/2 - canvas.width/4, canvas.height/2 - canvas.height/4, canvas.width/2, canvas.height/2);
		}
	}
	
    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
	ctx.fillStyle = "#000000";
	if(title) {
		ctx.fillText("High Score: " + score, 32, 32);
	} else {
		ctx.fillText("Score: " + score, 32, 32);
	}
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

// Let's play this game!
resizeGame();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible