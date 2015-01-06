function DeadMenu(){
	State.constructor.call(this);
	this.alwaysUpdate = false;
	//this.drawBG = true;
	
	var deadText = new TextBox("YOU WERE MAULED");
	deadText.color = "#ff0000";
	deadText.font = "Nosifer";
	deadText.fontSize = 24;
	deadText.dropShadow = false;
	deadText.drawBG = false;
	deadText.center = true;
	deadText.lrot = 0;
	deadText.lrot2 = 0;
	deadText.update = function(delta){
		this.lrot += 0.1;
		this.lrot2 += 0.05;
		this.x = (canvas.width)/2;
		this.y = 175+Math.sin(this.lrot)*10;
		this.rotation = Math.sin(this.lrot2)*Math.PI/10;
	}
	this.world.addChild(deadText);
	
	this.scoreText = new TextBox("Score");
	this.scoreText.color = "#ff0000";
	this.scoreText.font = "Nosifer";
	this.scoreText.fontSize = 24;
	this.scoreText.dropShadow = false;
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
	this.newBtn.label.font = "Nosifer";
	this.newBtn.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.newBtn.offsetX = -32;
	this.newBtn.center = true;
	this.newBtn.func = function(){
		//newGame();
		//states.pop();
	}
	this.gui.addChild(this.newBtn);
	
	this.main = new TextButton("Main Menu");
	this.main.x = 200;
	this.main.y = 475;
	this.main.drawBG = false;
	this.main.label.font = "Nosifer";
	this.main.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.scoreBtn.offsetX = -32;
	this.main.center = true;
	this.main.func = function(){
	}
	this.gui.addChild(this.main);
}

DeadMenu.prototype = new State();