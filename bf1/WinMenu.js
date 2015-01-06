function WinMenu(){
	State.constructor.call(this);
	this.alwaysUpdate = false;
	//this.drawBG = true;
	
	var grass = new Sprite();
	grass.width = 600;
	grass.height = 600;
	grass.image = Textures.load("images/grass.jpg");
	this.world.addChild(grass);
	
	var titleBear = new Sprite();
	titleBear.width = 250;
	titleBear.height = 380;
	titleBear.offsetX = -120;
	titleBear.offsetY = -190;
	titleBear.x = 200;
	titleBear.y = 300;
	titleBear.image = Textures.load("images/titlebear.png");
	titleBear.alpha = 1.0;
	titleBear.tilt = 0;
	this.world.addChild(titleBear);
	this.titleBear = titleBear;
	
	titleBear.update = function(delta){
		this.tilt += 0.01;
		//this.scaleX = 1-Math.abs(Math.sin(this.tilt))*0.5;
		//this.scaleX = Math.sin(this.tilt);
		this.rotation = this.tilt;//Math.sin(this.tilt)*Math.PI/20;
	}
	
	var spot = new Sprite();
	spot.width = 800;
	spot.height = 800;
	spot.offsetX = -spot.width/2;
	//spot.offsetY = -190;
	spot.x = 200;
	spot.y = -75;
	spot.image = Textures.load("images/spot2.png");
	//spot.alpha = 0.5;
	//spot.blendMode = "destination-atop";
	spot.blendMode = "lighter";
	this.world.addChild(spot);
	spot.blendFunc = BLEND_ADD;
	spot.lrot = Math.PI;
	spot.update = function(delta){
		this.lrot += 0.05;
		//this.x = (canvas.width)/2;
		//this.y = 250+Math.sin(this.lrot)*10;
		this.rotation = Math.sin(this.lrot)*Math.PI/10;
	}

	var spotmask = new Sprite();
	spotmask.width = spot.width;
	spotmask.height = spot.height;
	spotmask.offsetX = spot.offsetX;
	//spotmask.offsetY = -190;
	//spotmask.x = 200;
	//spotmask.y = 300;
	spotmask.image = Textures.load("images/spot2.png");
	spotmask.alpha = 1.0;
	spotmask.blendMode = "destination-atop";
	spotmask.blendFunc = BLEND_MULTIPLY;
	spot.addChild(spotmask);
	
	var winText = new TextBox("MOTHER BEAR DEFEATED");
	winText.color = "#ffffff";
	winText.font = "Nosifer";
	winText.fontSize = 24;
	winText.dropShadow = true;
	winText.drawBG = false;
	winText.center = true;
	winText.lrot = 0;
	winText.lrot2 = 0;
	winText.update = function(delta){
		this.lrot += 0.1;
		this.lrot2 += 0.05;
		this.x = (canvas.width)/2;
		this.y = 175+Math.sin(this.lrot)*10;
		this.rotation = Math.sin(this.lrot2)*Math.PI/10;
	}
	this.world.addChild(winText);
	
	this.scoreText = new TextBox("Score");
	this.scoreText.color = "#ffffff";
	this.scoreText.font = "Nosifer";
	this.scoreText.fontSize = 24;
	this.scoreText.dropShadow = true;
	this.scoreText.drawBG = false;
	this.scoreText.center = true;
	this.scoreText.lrot = Math.PI;
	this.scoreText.lrot2 = Math.PI;
	this.scoreText.update = function(delta){
		this.lrot += 0.1;
		this.lrot2 += 0.05;
		this.x = (canvas.width)/2;
		this.y = 250+Math.sin(this.lrot)*10;
		this.rotation = Math.sin(this.lrot2)*Math.PI/10;
	}
	this.world.addChild(this.scoreText);
	
	var nameText = new TextBox("Enter Name");
	nameText.x = 200;
	nameText.y = 400;
	//button.offsetX = -32;
	nameText.font = "Nosifer";
	nameText.color = "#ffffff";
	nameText.drawBG = true;
	nameText.center = true;
	nameText.editable = true;
	nameText.clearOnFocus = true;
	this.nameText = nameText;
	this.gui.addChild(nameText);
	
	this.scoreBtn = new TextButton("Submit Score");
	this.scoreBtn.x = 200;
	this.scoreBtn.y = 425;
	this.scoreBtn.drawBG = false;
	this.scoreBtn.dropShadow = true;
	this.scoreBtn.label.font = "Nosifer";
	this.scoreBtn.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.scoreBtn.offsetX = -32;
	this.scoreBtn.center = true;
	this.scoreBtn.func = function(){
	}
	this.gui.addChild(this.scoreBtn);
	
	this.newBtn = new TextButton("New Game");
	this.newBtn.x = 200;
	this.newBtn.y = 450;
	this.newBtn.drawBG = false;
	this.newBtn.dropShadow = true;
	this.newBtn.label.font = "Nosifer";
	this.newBtn.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.newBtn.offsetX = -32;
	this.newBtn.center = true;
	this.newBtn.func = function(){
		//newGame();
		//states.pop();
	}
	//this.gui.addChild(this.newBtn);
	
	this.main = new TextButton("Main Menu");
	this.main.x = 200;
	this.main.y = 475;
	this.main.drawBG = false;
	this.main.dropShadow = true;
	this.main.label.font = "Nosifer";
	this.main.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.scoreBtn.offsetX = -32;
	this.main.center = true;
	this.main.func = function(){
	}
	//this.gui.addChild(this.main);
}

WinMenu.prototype = new State();