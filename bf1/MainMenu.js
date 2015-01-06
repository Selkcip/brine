function MainMenu(){
	State.call(this);
	this.alwaysUpdate = false;
	//this.drawBG = true;
	
	var grass = new Sprite();
	grass.width = 600;
	grass.height = 600;
	grass.tilesX = 2;
	grass.tilesY = 2;
	grass.image = Textures.load("images/grass.jpg");
	this.world.addChild(grass);
	grass.update = function(delta){
		this.scrollY += 1*delta;
		//this.scrollX -= 2;
	}
	
	var titleBear = new Sprite();
	titleBear.width = 250;
	titleBear.height = 380;
	titleBear.offsetX = -120;
	titleBear.offsetY = -190;
	titleBear.x = 200;
	titleBear.y = 300;
	//titleBear.tilesX = 2;
	//titleBear.tilesY = 2;
	titleBear.image = Textures.load("images/titlebear.png");
	titleBear.alpha = 1.0;
	titleBear.tilt = 0;
	this.world.addChild(titleBear);
	this.titleBear = titleBear;
	
	titleBear.update = function(delta){
		this.tilt += 0.01*delta;
		//this.scaleX = 1-Math.abs(Math.sin(this.tilt))*0.5;
		//this.scaleX = Math.sin(this.tilt);
		this.rotation = Math.sin(this.tilt)*Math.PI/20;
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
		this.lrot += 0.01*delta;
		//this.x = (canvas.width)/2;
		//this.y = 250+Math.sin(this.lrot)*10;
		this.rotation = Math.sin(this.lrot)*Math.PI/10;
	}

	var spotmask = new Sprite();
	spotmask.width = spot.width;
	spotmask.height = spot.height;
	//spotmask.offsetX = spot.offsetX;
	//spotmask.offsetY = -190;
	//spotmask.x = 200;
	//spotmask.y = 300;
	spotmask.image = Textures.load("images/spot2.png");
	spotmask.alpha = 1.0;
	spotmask.blendMode = "destination-atop";
	spotmask.blendFunc = BLEND_MULTIPLY;
	spot.addChild(spotmask);
	
	var title = new TextBox("Bear Force One");
	title.x = 200;
	title.y = 100;
	title.font = "Nosifer";
	title.fontSize = 30;
	title.color = "#ffffff";
	title.center = true;
	title.padTop = 5;
	title.padBottom = 5;
	//title.drawBG = true;
	title.dropShadow = true;
	this.world.addChild(title);
	
	this.button = new TextButton("Start Game");
	this.button.x = 200;
	this.button.y = 500;
	this.button.drawBG = false;
	this.button.label.font = "Nosifer";
	this.button.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//button.offsetX = -32;
	this.button.center = true;
	this.gui.addChild(this.button);
	
	this.scoreBtn = new TextButton("View High Scores");
	this.scoreBtn.x = 200;
	this.scoreBtn.y = 525;
	this.scoreBtn.drawBG = false;
	this.scoreBtn.label.font = "Nosifer";
	this.scoreBtn.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.scoreBtn.offsetX = -32;
	this.scoreBtn.center = true;
	this.scoreBtn.func = function(){
	}
	this.gui.addChild(this.scoreBtn);
	
	this.mute = new TextButton("Mute Sounds");
	this.mute.x = 200;
	this.mute.y = 550;
	this.mute.drawBG = false;
	this.mute.label.font = "Nosifer";
	this.mute.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.scoreBtn.offsetX = -32;
	this.mute.center = true;
	this.mute.func = function(){
		Sounds.toggleMuted();
	}
	this.mute.update = function(){
		if(Sounds.muted){
			this.text = "Unmute Sounds";
		}else{
			this.text = "Mute Sounds";
		}
	}
	this.gui.addChild(this.mute);
	
	this.textBox = new TextBox("Enter Name");
	this.textBox.x = 200;
	this.textBox.y = 550;
	//button.offsetX = -32;
	this.textBox.drawBG = true;
	this.textBox.center = true;
	this.textBox.editable = true;
	this.textBox.clearOnFocus = true;
	//this.gui.addChild(this.textBox);
}

MainMenu.prototype = new State();