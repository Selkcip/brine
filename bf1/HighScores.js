Textures.load("images/bigme.png");
function HighScores(){
	State.constructor.call(this);
	this.alwaysUpdate = false;
	//this.drawBG = true;
	this.texts = new Array();
	
	var grass = new Sprite();
	grass.width = 600;
	grass.height = 600;
	grass.image = Textures.load("images/grass.jpg");
	this.world.addChild(grass);
	
	var titleBear = new Sprite();
	titleBear.width = 170;
	titleBear.height = 360;
	titleBear.offsetX = -titleBear.width/2;
	titleBear.offsetY = -titleBear.height/2;
	titleBear.x = 200;
	titleBear.y = 300;
	titleBear.image = Textures.load("images/bigme.png");
	titleBear.alpha = 1.0;
	titleBear.tilt = 0;
	this.world.addChild(titleBear);
	this.titleBear = titleBear;
	
	titleBear.update = function(delta){
		this.tilt += 0.01;
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
	
	var title = new TextBox("High Scores");
	title.x = 200;
	title.y = 100;
	title.font = "Nosifer";
	title.fontSize = 30;
	title.color = "#ff0000";
	title.center = true;
	title.padTop = 5;
	title.padBottom = 5;
	//title.drawBG = true;
	this.gui.addChild(title);
	
	this.main = new TextButton("Main Menu");
	this.main.x = 200;
	this.main.y = 575;
	this.main.drawBG = false;
	this.main.label.font = "Nosifer";
	this.main.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
	//this.scoreBtn.offsetX = -32;
	this.main.center = true;
	this.main.func = function(){
	}
	this.gui.addChild(this.main);
}

HighScores.prototype = new State();

HighScores.prototype.submitScore = function(name, score){
	var scoreScreen = this;
	var xml = xmlRequest();
	xml.onreadystatechange = function(){
		if(xml.readyState == 4){
		
			var data = String(xml.responseText).split(";");
			var scores = new Array();
			for(var score in data){
				score = data[score];
				if(score != ""){
					scores.push(score.split(":"));
				}
			}
			
			scoreScreen.displayScores(scores);
		}
	}
	try{
		xml.open("GET","http://www.jar42.com/brine/devtools/scores.php?action=create&dev_code=c33f1122-d0d9-11e1-8335-003048cab8e6&player_name="+name+"&score="+score,true);
		xml.send(null);
	}catch(e){
	}
}

HighScores.prototype.loadScores = function(){
	var scoreScreen = this;
	var xml = xmlRequest();
	xml.onreadystatechange = function(){
		if(xml.readyState == 4){
		
			var data = String(xml.responseText).split(";");
			var scores = new Array();
			for(var score in data){
				score = data[score];
				if(score != ""){
					scores.push(score.split(":"));
				}
			}
			
			scoreScreen.displayScores(scores);
		}
	}
	try{
		xml.open("GET","http://www.jar42.com/brine/devtools/scores.php?action=get&dev_code=c33f1122-d0d9-11e1-8335-003048cab8e6",true);
		xml.send(null);
	}catch(e){
	}
}

HighScores.prototype.displayScores = function(scores){
	for(var text in this.texts){
		this.gui.removeChild(this.texts[text]);
	}
	println(this.gui.children.length);
	this.texts = new Array();

	scores.sort(HighScoresSort);
	
	var x = 0;
	var y = 125;
	for(var i = 0; i < scores.length; i++){
		var entry = new TextBox(scores[i][0]);
		entry.x = x;
		entry.y = y;
		entry.font = "Nosifer";
		entry.fontSize = 24;
		entry.color = "#ffffff";
		entry.dropShadow = true;
		entry.center = false;
		entry.padTop = 5;
		entry.padBottom = 5;
		//title.drawBG = true;
		this.gui.addChild(entry);
		this.texts.push(entry);
		
		entry = new TextBox(scores[i][1]);
		entry.x = x;
		entry.y = y;
		entry.font = "Nosifer";
		entry.fontSize = 24;
		entry.color = "#ffffff";
		entry.dropShadow = true;
		entry.center = false;
		entry.padTop = 5;
		entry.padBottom = 5;
		entry.x = canvas.width-entry.getDims().x;
		this.gui.addChild(entry);
		this.texts.push(entry);
		
		y += entry.getDims().y;
	}
}

function HighScoresSort(a,b){
	return b[1]-a[1];
}