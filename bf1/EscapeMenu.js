function EscapeMenu(manager){
	State.constructor.call(this);
	this.alwaysUpdate = false;
	//this.drawBG = true;
	this.manager = manager;
	
	var paused = new TextBox("Paused");
	paused.color = "#ffffff";
	paused.font = "Nosifer";
	paused.fontSize = 24;
	paused.dropShadow = false;
	paused.drawBG = false;
	paused.center = true;
	paused.lrot = 0;
	paused.lrot2 = 0;
	paused.update = function(delta){
		this.lrot += 0.1;
		this.lrot2 += 0.05;
		this.x = (canvas.width)/2;
		this.y = 250+Math.sin(this.lrot)*10;
		this.rotation = Math.sin(this.lrot2)*Math.PI/10;
	}
	this.world.addChild(paused);
	
	this.resume = new TextButton("Resume");
	this.resume.x = 200;
	this.resume.y = 400;
	this.resume.drawBG = false;
	this.resume.label.font = "Nosifer";
	this.resume.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.scoreBtn.offsetX = -32;
	this.resume.center = true;
	//var menu = this;
	this.resume.func = function(){
		manager.pop();
	}
	this.gui.addChild(this.resume);
	
	this.mute = new TextButton("Mute Sounds");
	this.mute.x = 200;
	this.mute.y = 425;
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
	
	this.restart = new TextButton("New Game");
	this.restart.x = 200;
	this.restart.y = 450;
	this.restart.drawBG = false;
	this.restart.label.font = "Nosifer";
	this.restart.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.newBtn.offsetX = -32;
	this.restart.center = true;
	this.restart.func = function(){
		//newGame();
		//states.pop();
	}
	this.gui.addChild(this.restart);
	
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
	
	//this.input.addFunc(13, function(){manager.pop();});
	//this.input.addFunc(27, function(){manager.pop();});
}

EscapeMenu.prototype = new State();